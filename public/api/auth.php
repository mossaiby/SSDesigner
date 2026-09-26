<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure users table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
      `id` VARCHAR(64) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password_hash` VARCHAR(255) NOT NULL,
      `role` VARCHAR(64) NOT NULL DEFAULT 'administrator',
      `last_login` VARCHAR(64) DEFAULT NULL,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $cols = [
        "ALTER TABLE `users` ADD COLUMN `password_hash` VARCHAR(255) DEFAULT ''",
        "ALTER TABLE `users` ADD COLUMN `role` VARCHAR(64) DEFAULT 'administrator'",
        "ALTER TABLE `users` ADD COLUMN `last_login` VARCHAR(64) DEFAULT NULL"
    ];
    foreach ($cols as $c) {
        try { $pdo->exec($c); } catch (Throwable $ex) {}
    }
} catch (Throwable $e) {}

// Check if any admin exists; if zero users, create primary admin
$count = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
if ($count === 0) {
    $hash = password_hash('AeroAdmin2026!', PASSWORD_BCRYPT);
    $ins = $pdo->prepare("INSERT INTO users (id, name, email, password_hash, role, last_login) VALUES (:id, :name, :email, :hash, :role, :ll)");
    $ins->execute([
        'id' => 'usr_admin_master',
        'name' => 'System Administrator',
        'email' => 'admin@ssdesigner.ir',
        'hash' => $hash,
        'role' => 'administrator',
        'll' => date('Y-m-d H:i:s')
    ]);
}

$action = isset($_GET['action']) ? trim($_GET['action']) : '';

// 1. List users
if ($method === 'GET' || $action === 'users') {
    $stmt = $pdo->query("SELECT id, name, email, role, last_login FROM users ORDER BY created_at ASC");
    $users = $stmt->fetchAll();
    $res = array_map(function($u) {
        return [
            'id' => $u['id'],
            'name' => $u['name'],
            'email' => $u['email'],
            'role' => $u['role'],
            'lastLogin' => $u['last_login'] ?: 'Never'
        ];
    }, $users);
    sendResponse($res);
}

// 2. Authentication Login
if ($method === 'POST' && ($action === 'login' || empty($action))) {
    $input = getJsonInput();
    if (empty($input['email'])) {
        sendError('Email address is required', 400);
    }

    $email = trim(strtolower($input['email']));
    $password = isset($input['password']) ? (string)$input['password'] : '';

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('User with this email not found in database', 404);
    }

    // Verify password if user has password_hash and password was sent
    if (!empty($user['password_hash']) && !empty($password)) {
        if (!password_verify($password, $user['password_hash'])) {
            sendError('Invalid password. Please check your credentials.', 401);
        }
    }

    // Update last login
    $now = date('Y-m-d H:i:s');
    $upd = $pdo->prepare("UPDATE users SET last_login = :ll WHERE id = :id");
    $upd->execute(['ll' => $now, 'id' => $user['id']]);

    // Return safe user object
    sendResponse([
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'lastLogin' => $now
        ],
        'token' => 'tok_' . bin2hex(random_bytes(16))
    ]);
}

// 3. Set or Change User Password
if ($method === 'POST' && $action === 'set-password') {
    $input = getJsonInput();
    if (empty($input['email']) || empty($input['newPassword'])) {
        sendError('Email and newPassword are required', 400);
    }

    $email = trim(strtolower($input['email']));
    $newPassword = (string)$input['newPassword'];

    if (strlen($newPassword) < 6) {
        sendError('Password must be at least 6 characters long', 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE LOWER(email) = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('User not found', 404);
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    $upd = $pdo->prepare("UPDATE users SET password_hash = :hash WHERE id = :id");
    $upd->execute(['hash' => $hash, 'id' => $user['id']]);

    sendResponse([
        'success' => true,
        'message' => 'Password for user ' . $email . ' successfully updated in MySQL database.'
    ]);
}
