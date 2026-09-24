<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `type` VARCHAR(32) NOT NULL DEFAULT 'photo',
  `title` VARCHAR(255) NOT NULL,
  `caption` TEXT,
  `url` TEXT NOT NULL,
  `thumbnail_url` TEXT,
  `duration` VARCHAR(32) DEFAULT NULL,
  `target_id` VARCHAR(64) DEFAULT NULL,
  `target_type` VARCHAR(32) DEFAULT NULL,
  `technical_note` TEXT,
  `dimensions` VARCHAR(64) DEFAULT NULL,
  `tags` LONGTEXT,
  `created_at` VARCHAR(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

function formatMediaRow($row) {
    if (!$row) return null;
    return [
        'id' => $row['id'],
        'type' => $row['type'],
        'title' => $row['title'],
        'caption' => $row['caption'] ?: '',
        'url' => $row['url'],
        'thumbnailUrl' => $row['thumbnail_url'],
        'duration' => $row['duration'],
        'targetId' => $row['target_id'] ?: '',
        'targetType' => $row['target_type'] ?: 'software',
        'technicalNote' => $row['technical_note'] ?: '',
        'dimensions' => $row['dimensions'] ?: '',
        'tags' => json_decode($row['tags'] ?: '[]', true) ?: [],
        'createdAt' => $row['created_at'] ?: date('Y-m-d')
    ];
}

if ($method === 'GET') {
    $targetId = isset($_GET['targetId']) ? trim($_GET['targetId']) : null;
    if ($targetId) {
        $stmt = $pdo->prepare("SELECT * FROM media WHERE target_id = :tid ORDER BY created_at DESC");
        $stmt->execute(['tid' => $targetId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM media ORDER BY created_at DESC");
    }
    $rows = $stmt->fetchAll();
    sendResponse(array_map('formatMediaRow', $rows));
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['title']) || empty($input['url'])) {
        sendError('Title and URL are required', 400);
    }

    $id = !empty($input['id']) ? $input['id'] : 'med_' . uniqid();
    $type = !empty($input['type']) ? $input['type'] : 'photo';
    $title = trim($input['title']);
    $caption = !empty($input['caption']) ? $input['caption'] : '';
    $url = trim($input['url']);
    $thumb = !empty($input['thumbnailUrl']) ? $input['thumbnailUrl'] : null;
    $dur = !empty($input['duration']) ? $input['duration'] : null;
    $targetId = !empty($input['targetId']) ? $input['targetId'] : null;
    $targetType = !empty($input['targetType']) ? $input['targetType'] : null;
    $note = !empty($input['technicalNote']) ? $input['technicalNote'] : '';
    $dim = !empty($input['dimensions']) ? $input['dimensions'] : '';
    $tags = json_encode(!empty($input['tags']) ? $input['tags'] : []);
    $createdAt = !empty($input['createdAt']) ? $input['createdAt'] : date('Y-m-d');

    $stmt = $pdo->prepare("INSERT INTO media 
        (id, type, title, caption, url, thumbnail_url, duration, target_id, target_type, technical_note, dimensions, tags, created_at)
        VALUES (:id, :type, :title, :caption, :url, :thumb, :dur, :tid, :ttype, :note, :dim, :tags, :cat)");

    $stmt->execute([
        'id' => $id, 'type' => $type, 'title' => $title, 'caption' => $caption,
        'url' => $url, 'thumb' => $thumb, 'dur' => $dur, 'tid' => $targetId,
        'ttype' => $targetType, 'note' => $note, 'dim' => $dim, 'tags' => $tags, 'cat' => $createdAt
    ]);

    $stmt = $pdo->prepare("SELECT * FROM media WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatMediaRow($stmt->fetch()), 201);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Media ID is required', 400);

    $stmt = $pdo->prepare("DELETE FROM media WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(['success' => true]);
}
