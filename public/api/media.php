<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($db['media']) || !is_array($db['media'])) {
    $db['media'] = [];
}

if ($method === 'GET') {
    $targetId = isset($_GET['targetId']) ? trim($_GET['targetId']) : null;
    if ($targetId) {
        $filtered = array_values(array_filter($db['media'], function($m) use ($targetId) {
            return isset($m['targetId']) && $m['targetId'] === $targetId;
        }));
        sendResponse($filtered);
    } else {
        sendResponse($db['media']);
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['title']) || empty($input['url'])) sendError('Title and URL are required', 400);

    $newItem = array_merge([
        'id' => 'med_' . uniqid(),
        'createdAt' => date('Y-m-d'),
        'tags' => [],
        'targetType' => 'software'
    ], $input);

    array_unshift($db['media'], $newItem);
    saveJsonDb($db);
    sendResponse($newItem, 201);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        if (!empty($input['id'])) $id = $input['id'];
    }
    if (!$id) sendError('Media ID is required', 400);

    $db['media'] = array_values(array_filter($db['media'], function($m) use ($id) {
        return $m['id'] !== $id;
    }));
    saveJsonDb($db);
    sendResponse(['success' => true]);
}
