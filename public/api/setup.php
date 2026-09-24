<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendError('Could not connect to MySQL database. Please verify DB credentials in /api/config.php', 500);
}

try {
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    $pdo->exec($sql);

    // Check if admin user exists, if not create default operator with default password
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => 'admin@ssdesigner.ir']);
    $user = $stmt->fetch();

    if (!$user) {
        $hash = password_hash('AeroAdmin2026!', PASSWORD_BCRYPT);
        $insert = $pdo->prepare("INSERT INTO users (id, name, email, password_hash, role, last_login) VALUES (:id, :name, :email, :hash, :role, :last_login)");
        $insert->execute([
            'id' => 'usr_admin_master',
            'name' => 'System Administrator',
            'email' => 'admin@ssdesigner.ir',
            'hash' => $hash,
            'role' => 'administrator',
            'last_login' => date('Y-m-d H:i:s')
        ]);
    }

    sendResponse([
        'success' => true,
        'message' => 'All MySQL database tables initialized successfully!',
        'database' => DB_NAME,
        'tables' => ['software', 'projects', 'articles', 'media', 'leads', 'users', 'audit_logs']
    ]);
} catch (Exception $e) {
    sendError('Database setup failed: ' . $e->getMessage(), 500);
}
