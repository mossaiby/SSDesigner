<?php
require_once __DIR__ . '/config.php';

$db = loadJsonDb();
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if (!isset($db['users']) || !is_array($db['users'])) {
    $db['users'] = [];
}

// 1. List Users (exclude password_hash from response)
if ($method === 'GET' || $action === 'users') {
    $safeUsers = array_map(function($u) {
        return [
            'id' => $u['id'],
            'name' => $u['name'],
            'email' => $u['email'],
            'role' => isset($u['role']) ? $u['role'] : 'administrator',
            'lastLogin' => isset($u['last_login']) ? $u['last_login'] : 'Never'
        ];
    }, $db['users']);
    sendResponse($safeUsers);
}

// 2. Login Endpoint
if ($method === 'POST' && ($action === 'login' || empty($action))) {
    $input = getJsonInput();
    if (empty($input['email'])) {
        sendError('Email is required', 400);
    }

    $email = trim(strtolower($input['email']));
    $password = isset($input['password']) ? (string)$input['password'] : '';

    $targetUser = null;
    $targetIndex = -1;

    foreach ($db['users'] as $idx => $u) {
        if (strtolower(trim($u['email'])) === $email) {
            $targetUser = $u;
            $targetIndex = $idx;
            break;
        }
    }

    if (!$targetUser) {
        sendError('User not found in system database.', 404);
    }

    $storedHash = isset($targetUser['password_hash']) ? (string)$targetUser['password_hash'] : '';

    if (empty($storedHash) || !password_verify($password, $storedHash)) {
        sendError('Invalid password. Please check your credentials.', 401);
    }

    $now = date('Y-m-d H:i:s');
    $db['users'][$targetIndex]['last_login'] = $now;
    saveJsonDb($db);

    sendResponse([
        'user' => [
            'id' => $targetUser['id'],
            'name' => $targetUser['name'],
            'email' => $targetUser['email'],
            'role' => isset($targetUser['role']) ? $targetUser['role'] : 'administrator',
            'lastLogin' => $now
        ],
        'token' => 'tok_' . bin2hex(random_bytes(16))
    ]);
}

// 3. Change Password Endpoint (Strictly authenticated: requires valid current password)
if ($method === 'POST' && $action === 'set-password') {
    $input = getJsonInput();
    if (empty($input['email']) || empty($input['currentPassword']) || empty($input['newPassword'])) {
        sendError('Email, currentPassword, and newPassword are required.', 400);
    }

    $email = trim(strtolower($input['email']));
    $currentPassword = (string)$input['currentPassword'];
    $newPassword = (string)$input['newPassword'];

    if (strlen($newPassword) < 6) {
        sendError('New password must be at least 6 characters long.', 400);
    }

    $foundIndex = -1;
    foreach ($db['users'] as $idx => $u) {
        if (strtolower(trim($u['email'])) === $email) {
            $foundIndex = $idx;
            break;
        }
    }

    if ($foundIndex === -1) {
        sendError('User account not found.', 404);
    }

    $storedHash = isset($db['users'][$foundIndex]['password_hash']) ? (string)$db['users'][$foundIndex]['password_hash'] : '';

    if (empty($storedHash) || !password_verify($currentPassword, $storedHash)) {
        sendError('Authentication failed: Current password is incorrect.', 401);
    }

    $db['users'][$foundIndex]['password_hash'] = password_hash($newPassword, PASSWORD_BCRYPT);
    unset($db['users'][$foundIndex]['password']);
    saveJsonDb($db);

    sendResponse([
        'success' => true,
        'message' => 'Password updated successfully.'
    ]);
}
