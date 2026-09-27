<?php
require_once __DIR__ . '/config.php';

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

saveJsonDb($default);

sendResponse([
    'success' => true,
    'message' => 'Database successfully reset to pristine state.'
]);
