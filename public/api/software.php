<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($db['software']) || !is_array($db['software'])) {
    $db['software'] = [];
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if ($id) {
        $found = null;
        foreach ($db['software'] as $item) {
            if ($item['id'] === $id) {
                $found = $item;
                break;
            }
        }
        if (!$found) sendError('Software not found', 404);
        sendResponse($found);
    } else {
        sendResponse($db['software']);
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['name'])) sendError('Software name is required', 400);

    $newItem = array_merge([
        'id' => 'soft_' . uniqid(),
        'createdAt' => date('Y-m-d')
    ], $input);

    array_unshift($db['software'], $newItem);
    saveJsonDb($db);
    sendResponse($newItem, 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Software ID is required', 400);

    $idx = -1;
    foreach ($db['software'] as $i => $item) {
        if ($item['id'] === $id) {
            $idx = $i;
            break;
        }
    }

    if ($idx === -1) sendError('Software not found', 404);

    $db['software'][$idx] = array_merge($db['software'][$idx], $input);
    saveJsonDb($db);
    sendResponse($db['software'][$idx]);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if (!$id) {
        $input = getJsonInput();
        if (!empty($input['id'])) $id = $input['id'];
    }
    if (!$id) sendError('Software ID is required', 400);

    $db['software'] = array_values(array_filter($db['software'], function($item) use ($id) {
        return $item['id'] !== $id;
    }));
    saveJsonDb($db);
    sendResponse(['success' => true]);
}
