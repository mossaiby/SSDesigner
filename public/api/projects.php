<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($db['projects']) || !is_array($db['projects'])) {
    $db['projects'] = [];
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if ($id) {
        $found = null;
        foreach ($db['projects'] as $item) {
            if ($item['id'] === $id) {
                $found = $item;
                break;
            }
        }
        if (!$found) sendError('Project not found', 404);
        sendResponse($found);
    } else {
        sendResponse($db['projects']);
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['title'])) sendError('Project title is required', 400);

    $newItem = array_merge([
        'id' => 'proj_' . uniqid(),
        'createdAt' => date('Y-m-d'),
        'gallery' => []
    ], $input);

    array_unshift($db['projects'], $newItem);
    saveJsonDb($db);
    sendResponse($newItem, 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Project ID is required', 400);

    $idx = -1;
    foreach ($db['projects'] as $i => $item) {
        if ($item['id'] === $id) {
            $idx = $i;
            break;
        }
    }

    if ($idx === -1) sendError('Project not found', 404);

    $db['projects'][$idx] = array_merge($db['projects'][$idx], $input);
    saveJsonDb($db);
    sendResponse($db['projects'][$idx]);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        if (!empty($input['id'])) $id = $input['id'];
    }
    if (!$id) sendError('Project ID is required', 400);

    $db['projects'] = array_values(array_filter($db['projects'], function($item) use ($id) {
        return $item['id'] !== $id;
    }));
    saveJsonDb($db);
    sendResponse(['success' => true]);
}
