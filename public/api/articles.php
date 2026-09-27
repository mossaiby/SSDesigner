<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];

if (!isset($db['articles']) || !is_array($db['articles'])) {
    $db['articles'] = [];
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if ($id) {
        $found = null;
        foreach ($db['articles'] as $art) {
            if ($art['id'] === $id || (isset($art['slug']) && $art['slug'] === $id)) {
                $found = $art;
                break;
            }
        }
        if (!$found) sendError('Article not found', 404);
        sendResponse($found);
    } else {
        sendResponse($db['articles']);
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['title'])) sendError('Article title is required', 400);

    $id = !empty($input['id']) ? $input['id'] : 'post_' . uniqid();
    $title = trim($input['title']);
    $rawSlug = !empty($input['slug']) ? $input['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
    $slug = substr($rawSlug ?: ('post-' . substr(uniqid(), 0, 8)), 0, 180);

    $newArticle = [
        'id' => $id,
        'title' => $title,
        'slug' => $slug,
        'category' => !empty($input['category']) ? $input['category'] : 'Computational Mechanics',
        'readTime' => !empty($input['readTime']) ? $input['readTime'] : '6 min read',
        'excerpt' => !empty($input['excerpt']) ? $input['excerpt'] : '',
        'content' => !empty($input['content']) ? $input['content'] : '',
        'coverImage' => !empty($input['coverImage']) ? $input['coverImage'] : '/src/assets/images/hero_space_structure_1790188515133.jpg',
        'author' => [
            'name' => !empty($input['author']['name']) ? $input['author']['name'] : 'Lead Structural Engineer',
            'role' => !empty($input['author']['role']) ? $input['author']['role'] : 'Senior Researcher'
        ],
        'tags' => !empty($input['tags']) ? $input['tags'] : [],
        'publishedAt' => !empty($input['publishedAt']) ? $input['publishedAt'] : date('Y-m-d')
    ];

    array_unshift($db['articles'], $newArticle);
    saveJsonDb($db);
    sendResponse($newArticle, 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Article ID is required', 400);

    $idx = -1;
    foreach ($db['articles'] as $i => $art) {
        if ($art['id'] === $id) {
            $idx = $i;
            break;
        }
    }

    if ($idx === -1) sendError('Article not found', 404);

    $db['articles'][$idx] = array_merge($db['articles'][$idx], $input);
    saveJsonDb($db);
    sendResponse($db['articles'][$idx]);
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Article ID is required', 400);

    $db['articles'] = array_values(array_filter($db['articles'], function($art) use ($id) {
        return $art['id'] !== $id;
    }));
    saveJsonDb($db);
    sendResponse(['success' => true]);
}
