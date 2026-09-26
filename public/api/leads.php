<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `leads` (
      `id` VARCHAR(64) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL,
      `organization` VARCHAR(255),
      `inquiry_type` VARCHAR(128),
      `message` TEXT,
      `software_interest` VARCHAR(255),
      `status` VARCHAR(64) DEFAULT 'new',
      `submitted_at` VARCHAR(64) DEFAULT NULL,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $cols = [
        "ALTER TABLE `leads` ADD COLUMN `organization` VARCHAR(255)",
        "ALTER TABLE `leads` ADD COLUMN `inquiry_type` VARCHAR(128)",
        "ALTER TABLE `leads` ADD COLUMN `message` TEXT",
        "ALTER TABLE `leads` ADD COLUMN `software_interest` VARCHAR(255)",
        "ALTER TABLE `leads` ADD COLUMN `status` VARCHAR(64) DEFAULT 'new'",
        "ALTER TABLE `leads` ADD COLUMN `submitted_at` VARCHAR(64) DEFAULT NULL"
    ];
    foreach ($cols as $c) {
        try { $pdo->exec($c); } catch (Throwable $ex) {}
    }
} catch (Throwable $e) {}

function formatLeadRow($row) {
    if (!$row) return null;
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'email' => $row['email'],
        'organization' => $row['organization'] ?: '',
        'inquiryType' => $row['inquiry_type'] ?: 'General Inquiry',
        'message' => $row['message'] ?: '',
        'softwareInterest' => $row['software_interest'] ?: '',
        'status' => $row['status'] ?: 'new',
        'submittedAt' => $row['submitted_at'] ?: date('Y-m-d H:i')
    ];
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();
    sendResponse(array_map('formatLeadRow', $rows));
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['name']) || empty($input['email'])) {
        sendError('Name and email are required', 400);
    }

    $id = !empty($input['id']) ? $input['id'] : 'lead_' . uniqid();
    $name = trim($input['name']);
    $email = trim($input['email']);
    $org = !empty($input['organization']) ? trim($input['organization']) : '';
    $inquiryType = !empty($input['inquiryType']) ? $input['inquiryType'] : 'General Inquiry';
    $message = !empty($input['message']) ? $input['message'] : '';
    $software = !empty($input['softwareInterest']) ? $input['softwareInterest'] : '';
    $status = 'new';
    $submittedAt = date('Y-m-d H:i');

    $stmt = $pdo->prepare("INSERT INTO leads 
        (id, name, email, organization, inquiry_type, message, software_interest, status, submitted_at)
        VALUES (:id, :name, :email, :org, :inq, :msg, :soft, :status, :sub)");

    $stmt->execute([
        'id' => $id, 'name' => $name, 'email' => $email, 'org' => $org,
        'inq' => $inquiryType, 'msg' => $message, 'soft' => $software,
        'status' => $status, 'sub' => $submittedAt
    ]);

    $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatLeadRow($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Lead ID is required', 400);

    if (isset($input['status'])) {
        $stmt = $pdo->prepare("UPDATE leads SET status = :status WHERE id = :id");
        $stmt->execute(['status' => $input['status'], 'id' => $id]);
    }

    $stmt = $pdo->prepare("SELECT * FROM leads WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatLeadRow($stmt->fetch()));
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        if (!empty($input['id'])) $id = $input['id'];
    }
    if (!$id) sendError('Lead ID is required', 400);

    $stmt = $pdo->prepare("DELETE FROM leads WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(['success' => true]);
}
