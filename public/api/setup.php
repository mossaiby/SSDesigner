<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendError('Could not connect to MySQL database. Please verify DB credentials in /api/config.php', 500);
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = getJsonInput();
    $isReset = ($method === 'POST' || isset($_GET['reset']) || !empty($input['reset']) || strpos($_SERVER['REQUEST_URI'], 'reset') !== false);

    $sql = file_get_contents(__DIR__ . '/schema.sql');
    $pdo->exec($sql);

    if ($isReset) {
        try {
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 0;");
            $pdo->exec("TRUNCATE TABLE software;");
            $pdo->exec("TRUNCATE TABLE projects;");
            $pdo->exec("TRUNCATE TABLE articles;");
            $pdo->exec("TRUNCATE TABLE media;");
            $pdo->exec("TRUNCATE TABLE leads;");
            $pdo->exec("TRUNCATE TABLE audit_logs;");
            $pdo->exec("SET FOREIGN_KEY_CHECKS = 1;");
        } catch (Throwable $ex) {
            // Fallback delete if truncate restricted
            $pdo->exec("DELETE FROM software;");
            $pdo->exec("DELETE FROM projects;");
            $pdo->exec("DELETE FROM articles;");
            $pdo->exec("DELETE FROM media;");
            $pdo->exec("DELETE FROM leads;");
            $pdo->exec("DELETE FROM audit_logs;");
        }
    }

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
        'message' => $isReset ? 'Database successfully reset to pristine state!' : 'All MySQL database tables initialized successfully!',
        'database' => DB_NAME,
        'tables' => ['software', 'projects', 'articles', 'media', 'leads', 'users', 'audit_logs']
    ]);
} catch (Exception $e) {
    sendError('Database setup/reset failed: ' . $e->getMessage(), 500);
}
