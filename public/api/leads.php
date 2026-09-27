<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($db['leads']) || !is_array($db['leads'])) {
    $db['leads'] = [];
}

if ($method === 'GET') {
    sendResponse($db['leads']);
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['name']) || empty($input['email'])) sendError('Name and email are required', 400);

    $newLead = array_merge([
        'id' => 'lead_' . uniqid(),
        'status' => 'new',
        'submittedAt' => date('Y-m-d H:i'),
        'organization' => '',
        'inquiryType' => 'General Inquiry',
        'message' => '',
        'softwareInterest' => ''
    ], $input);

    array_unshift($db['leads'], $newLead);
    saveJsonDb($db);
    sendResponse($newLead, 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Lead ID is required', 400);

    $idx = -1;
    foreach ($db['leads'] as $i => $l) {
        if ($l['id'] === $id) {
            $idx = $i;
            break;
        }
    }

    if ($idx === -1) sendError('Lead not found', 404);

    $db['leads'][$idx] = array_merge($db['leads'][$idx], $input);
    saveJsonDb($db);
    sendResponse($db['leads'][$idx]);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        if (!empty($input['id'])) $id = $input['id'];
    }
    if (!$id) sendError('Lead ID is required', 400);

    $db['leads'] = array_values(array_filter($db['leads'], function($l) use ($id) {
        return $l['id'] !== $id;
    }));
    saveJsonDb($db);
    sendResponse(['success' => true]);
}
