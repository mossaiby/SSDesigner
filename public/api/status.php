<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();

sendResponse([
    'connected' => true,
    'engine' => 'Bulletproof JSON File Storage Engine',
    'database' => 'ssdesign_db',
    'counts' => [
        'software' => count($db['software']),
        'projects' => count($db['projects']),
        'articles' => count($db['articles']),
        'media' => count($db['media']),
        'leads' => count($db['leads']),
        'users' => count($db['users']),
    ]
]);
