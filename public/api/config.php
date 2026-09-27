<?php
/**
 * SSDesigner Engineering Suite - Bulletproof JSON File Database Engine
 * Designed for flawless cPanel deployment on ssdesigner.ir without requiring MySQL or SQLite server setup.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function getJsonDbPath() {
    return __DIR__ . '/database.json';
}

function loadJsonDb() {
    $path = getJsonDbPath();
    if (!file_exists($path)) {
        $default = [
            'software' => [],
            'projects' => [],
            'articles' => [],
            'media' => [],
            'leads' => [],
            'users' => [
                [
                    'id' => 'usr_admin_master',
                    'name' => 'System Administrator',
                    'email' => 'admin@ssdesigner.ir',
                    'password_hash' => password_hash('AeroAdmin2026!', PASSWORD_BCRYPT),
                    'role' => 'administrator',
                    'last_login' => date('Y-m-d H:i:s')
                ]
            ],
            'audit_logs' => []
        ];
        @file_put_contents($path, json_encode($default, JSON_PRETTY_PRINT));
        return $default;
    }
    $content = @file_get_contents($path);
    $data = @json_decode($content, true);
    if (!is_array($data)) {
        return [
            'software' => [],
            'projects' => [],
            'articles' => [],
            'media' => [],
            'leads' => [],
            'users' => [],
            'audit_logs' => []
        ];
    }
    // Ensure keys exist
    if (!isset($data['software'])) $data['software'] = [];
    if (!isset($data['projects'])) $data['projects'] = [];
    if (!isset($data['articles'])) $data['articles'] = [];
    if (!isset($data['media'])) $data['media'] = [];
    if (!isset($data['leads'])) $data['leads'] = [];
    if (!isset($data['users'])) $data['users'] = [];
    if (!isset($data['audit_logs'])) $data['audit_logs'] = [];
    return $data;
}

function saveJsonDb($data) {
    $path = getJsonDbPath();
    @file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

function sendError($message, $statusCode = 400) {
    sendResponse(['error' => $message], $statusCode);
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}
