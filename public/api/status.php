<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
if (!$pdo) {
    sendResponse([
        'connected' => false,
        'engine' => 'MySQL (Disconnected)',
        'message' => 'Cannot establish PDO MySQL connection. Verify credentials in /api/config.php.'
    ]);
}

try {
    $counts = [
        'software' => (int)$pdo->query("SELECT COUNT(*) FROM software")->fetchColumn(),
        'projects' => (int)$pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn(),
        'articles' => (int)$pdo->query("SELECT COUNT(*) FROM articles")->fetchColumn(),
        'media'    => (int)$pdo->query("SELECT COUNT(*) FROM media")->fetchColumn(),
        'leads'    => (int)$pdo->query("SELECT COUNT(*) FROM leads")->fetchColumn(),
        'users'    => (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn(),
    ];

    sendResponse([
        'connected' => true,
        'engine' => 'MySQL ' . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
        'database' => DB_NAME,
        'counts' => $counts
    ]);
} catch (Exception $e) {
    sendResponse([
        'connected' => true,
        'engine' => 'MySQL Connected (Tables pending setup)',
        'database' => DB_NAME,
        'message' => 'Run /api/setup.php to initialize tables: ' . $e->getMessage()
    ]);
}
