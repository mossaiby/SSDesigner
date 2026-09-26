<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure table exists
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `software` (
      `id` VARCHAR(64) NOT NULL PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `tagline` TEXT,
      `category` VARCHAR(128) NOT NULL,
      `version` VARCHAR(64) NOT NULL,
      `description` TEXT,
      `key_features` LONGTEXT,
      `mathematical_foundations` LONGTEXT,
      `specs` LONGTEXT,
      `thumbnail` TEXT,
      `release_date` VARCHAR(64),
      `featured` TINYINT(1) DEFAULT 0,
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $cols = [
        "ALTER TABLE `software` ADD COLUMN `tagline` TEXT",
        "ALTER TABLE `software` ADD COLUMN `category` VARCHAR(128) DEFAULT 'Structural Solver'",
        "ALTER TABLE `software` ADD COLUMN `version` VARCHAR(64) DEFAULT '1.0.0'",
        "ALTER TABLE `software` ADD COLUMN `description` TEXT",
        "ALTER TABLE `software` ADD COLUMN `key_features` LONGTEXT",
        "ALTER TABLE `software` ADD COLUMN `mathematical_foundations` LONGTEXT",
        "ALTER TABLE `software` ADD COLUMN `specs` LONGTEXT",
        "ALTER TABLE `software` ADD COLUMN `thumbnail` TEXT",
        "ALTER TABLE `software` ADD COLUMN `release_date` VARCHAR(64)",
        "ALTER TABLE `software` ADD COLUMN `featured` TINYINT(1) DEFAULT 0"
    ];
    foreach ($cols as $c) {
        try { $pdo->exec($c); } catch (Throwable $ex) {}
    }
} catch (Throwable $e) {}

function formatSoftwareRow($row) {
    if (!$row) return null;
    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'tagline' => $row['tagline'] ?: '',
        'category' => $row['category'],
        'version' => $row['version'],
        'description' => $row['description'] ?: '',
        'keyFeatures' => json_decode($row['key_features'] ?: '[]', true) ?: [],
        'mathematicalFoundations' => json_decode($row['mathematical_foundations'] ?: '[]', true) ?: [],
        'specs' => json_decode($row['specs'] ?: '{}', true) ?: [
            'solverType' => 'Dynamic Relaxation',
            'formulation' => 'Co-rotational 3D space formulation',
            'elementsSupported' => ['Cables', 'Struts'],
            'maxNodesTested' => '100,000+ Spatial Nodes',
            'fileIOFormats' => ['DXF', 'STEP', 'JSON'],
            'hardwareAcceleration' => 'CUDA & Apple Metal',
            'complianceStandards' => ['Eurocode 3']
        ],
        'thumbnail' => $row['thumbnail'] ?: '/src/assets/images/software_form_finding_1790188528595.jpg',
        'releaseDate' => $row['release_date'] ?: date('Y-m-d'),
        'featured' => (bool)$row['featured'],
        'gallery' => []
    ];
}

// Route by method
if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM software WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) sendError('Software not found', 404);
        sendResponse(formatSoftwareRow($row));
    } else {
        $stmt = $pdo->query("SELECT * FROM software ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        $res = array_map('formatSoftwareRow', $rows);
        sendResponse($res);
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['name'])) {
        sendError('Software name is required', 400);
    }

    $id = !empty($input['id']) ? $input['id'] : 'soft_' . uniqid();
    $name = trim($input['name']);
    $tagline = !empty($input['tagline']) ? $input['tagline'] : '';
    $category = !empty($input['category']) ? $input['category'] : 'Computational Mechanics';
    $version = !empty($input['version']) ? $input['version'] : '2026.1';
    $description = !empty($input['description']) ? $input['description'] : '';
    $keyFeatures = json_encode(!empty($input['keyFeatures']) ? $input['keyFeatures'] : []);
    $mathFoundations = json_encode(!empty($input['mathematicalFoundations']) ? $input['mathematicalFoundations'] : []);
    $specs = json_encode(!empty($input['specs']) ? $input['specs'] : []);
    $thumbnail = !empty($input['thumbnail']) ? $input['thumbnail'] : '';
    $releaseDate = !empty($input['releaseDate']) ? $input['releaseDate'] : date('Y-m-d');
    $featured = !empty($input['featured']) ? 1 : 0;

    $stmt = $pdo->prepare("INSERT INTO software 
        (id, name, tagline, category, version, description, key_features, mathematical_foundations, specs, thumbnail, release_date, featured) 
        VALUES (:id, :name, :tagline, :category, :version, :description, :kf, :mf, :specs, :thumb, :rd, :featured)");

    $stmt->execute([
        'id' => $id,
        'name' => $name,
        'tagline' => $tagline,
        'category' => $category,
        'version' => $version,
        'description' => $description,
        'kf' => $keyFeatures,
        'mf' => $mathFoundations,
        'specs' => $specs,
        'thumb' => $thumbnail,
        'rd' => $releaseDate,
        'featured' => $featured
    ]);

    $stmt = $pdo->prepare("SELECT * FROM software WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatSoftwareRow($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Software ID is required for update', 400);

    $fields = [];
    $params = ['id' => $id];

    if (isset($input['name'])) { $fields[] = 'name = :name'; $params['name'] = $input['name']; }
    if (isset($input['tagline'])) { $fields[] = 'tagline = :tagline'; $params['tagline'] = $input['tagline']; }
    if (isset($input['category'])) { $fields[] = 'category = :category'; $params['category'] = $input['category']; }
    if (isset($input['version'])) { $fields[] = 'version = :version'; $params['version'] = $input['version']; }
    if (isset($input['description'])) { $fields[] = 'description = :description'; $params['description'] = $input['description']; }
    if (isset($input['thumbnail'])) { $fields[] = 'thumbnail = :thumbnail'; $params['thumbnail'] = $input['thumbnail']; }
    if (isset($input['releaseDate'])) { $fields[] = 'release_date = :release_date'; $params['release_date'] = $input['releaseDate']; }
    if (isset($input['featured'])) { $fields[] = 'featured = :featured'; $params['featured'] = $input['featured'] ? 1 : 0; }
    if (isset($input['keyFeatures'])) { $fields[] = 'key_features = :kf'; $params['kf'] = json_encode($input['keyFeatures']); }
    if (isset($input['mathematicalFoundations'])) { $fields[] = 'mathematical_foundations = :mf'; $params['mf'] = json_encode($input['mathematicalFoundations']); }
    if (isset($input['specs'])) { $fields[] = 'specs = :specs'; $params['specs'] = json_encode($input['specs']); }

    if (!empty($fields)) {
        $sql = "UPDATE software SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    $stmt = $pdo->prepare("SELECT * FROM software WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatSoftwareRow($stmt->fetch()));
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Software ID is required for deletion', 400);

    $stmt = $pdo->prepare("DELETE FROM software WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(['success' => true]);
}
