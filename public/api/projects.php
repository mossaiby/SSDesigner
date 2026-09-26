<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS `projects` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT,
  `category` VARCHAR(128) NOT NULL,
  `location` VARCHAR(255),
  `year` INT DEFAULT 2026,
  `span` VARCHAR(128),
  `structural_system` TEXT,
  `node_count` VARCHAR(64),
  `member_count` VARCHAR(64),
  `steel_weight_saved` VARCHAR(64),
  `client_or_engineer` VARCHAR(255),
  `software_used` LONGTEXT,
  `challenge` TEXT,
  `engineering_solution` TEXT,
  `hero_image` TEXT,
  `key_metrics` LONGTEXT,
  `featured` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

function formatProjectRow($row) {
    if (!$row) return null;
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'subtitle' => $row['subtitle'] ?: '',
        'category' => $row['category'],
        'location' => $row['location'] ?: 'International',
        'year' => (int)($row['year'] ?: 2026),
        'span' => $row['span'] ?: '',
        'structuralSystem' => $row['structural_system'] ?: '',
        'nodeCount' => $row['node_count'] ?: '',
        'memberCount' => $row['member_count'] ?: '',
        'steelWeightSaved' => $row['steel_weight_saved'] ?: '',
        'clientOrEngineer' => $row['client_or_engineer'] ?: '',
        'softwareUsed' => json_decode($row['software_used'] ?: '[]', true) ?: [],
        'challenge' => $row['challenge'] ?: '',
        'engineeringSolution' => $row['engineering_solution'] ?: '',
        'heroImage' => $row['hero_image'] ?: '',
        'keyMetrics' => json_decode($row['key_metrics'] ?: '[]', true) ?: [],
        'featured' => (bool)$row['featured'],
        'gallery' => []
    ];
}

if ($method === 'GET') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        if (!$row) sendError('Project not found', 404);
        sendResponse(formatProjectRow($row));
    } else {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        sendResponse(array_map('formatProjectRow', $rows));
    }
}

if ($method === 'POST') {
    $input = getJsonInput();
    if (empty($input['title'])) sendError('Project title is required', 400);

    $id = !empty($input['id']) ? $input['id'] : 'proj_' . uniqid();
    $title = trim($input['title']);
    $subtitle = !empty($input['subtitle']) ? $input['subtitle'] : '';
    $category = !empty($input['category']) ? $input['category'] : 'Sports & Arenas';
    $location = !empty($input['location']) ? $input['location'] : '';
    $year = !empty($input['year']) ? (int)$input['year'] : 2026;
    $span = !empty($input['span']) ? $input['span'] : '';
    $sys = !empty($input['structuralSystem']) ? $input['structuralSystem'] : '';
    $nodeCount = !empty($input['nodeCount']) ? $input['nodeCount'] : '';
    $memberCount = !empty($input['memberCount']) ? $input['memberCount'] : '';
    $steelWeightSaved = !empty($input['steelWeightSaved']) ? $input['steelWeightSaved'] : '';
    $client = !empty($input['clientOrEngineer']) ? $input['clientOrEngineer'] : '';
    $softwareUsed = json_encode(!empty($input['softwareUsed']) ? $input['softwareUsed'] : []);
    $challenge = !empty($input['challenge']) ? $input['challenge'] : '';
    $solution = !empty($input['engineeringSolution']) ? $input['engineeringSolution'] : '';
    $hero = !empty($input['heroImage']) ? $input['heroImage'] : '';
    $metrics = json_encode(!empty($input['keyMetrics']) ? $input['keyMetrics'] : []);
    $featured = !empty($input['featured']) ? 1 : 0;

    $stmt = $pdo->prepare("INSERT INTO projects 
        (id, title, subtitle, category, location, year, span, structural_system, node_count, member_count, steel_weight_saved, client_or_engineer, software_used, challenge, engineering_solution, hero_image, key_metrics, featured) 
        VALUES (:id, :title, :subtitle, :category, :loc, :year, :span, :sys, :nc, :mc, :sw, :client, :su, :ch, :sol, :hero, :metrics, :featured)");

    $stmt->execute([
        'id' => $id, 'title' => $title, 'subtitle' => $subtitle, 'category' => $category,
        'loc' => $location, 'year' => $year, 'span' => $span, 'sys' => $sys,
        'nc' => $nodeCount, 'mc' => $memberCount, 'sw' => $steelWeightSaved,
        'client' => $client, 'su' => $softwareUsed, 'ch' => $challenge,
        'sol' => $solution, 'hero' => $hero, 'metrics' => $metrics, 'featured' => $featured
    ]);

    $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatProjectRow($stmt->fetch()), 201);
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Project ID is required', 400);

    $fields = [];
    $params = ['id' => $id];

    if (isset($input['title'])) { $fields[] = 'title = :title'; $params['title'] = $input['title']; }
    if (isset($input['subtitle'])) { $fields[] = 'subtitle = :subtitle'; $params['subtitle'] = $input['subtitle']; }
    if (isset($input['category'])) { $fields[] = 'category = :category'; $params['category'] = $input['category']; }
    if (isset($input['location'])) { $fields[] = 'location = :location'; $params['location'] = $input['location']; }
    if (isset($input['year'])) { $fields[] = 'year = :year'; $params['year'] = (int)$input['year']; }
    if (isset($input['span'])) { $fields[] = 'span = :span'; $params['span'] = $input['span']; }
    if (isset($input['structuralSystem'])) { $fields[] = 'structural_system = :sys'; $params['sys'] = $input['structuralSystem']; }
    if (isset($input['heroImage'])) { $fields[] = 'hero_image = :hero'; $params['hero'] = $input['heroImage']; }
    if (isset($input['nodeCount'])) { $fields[] = 'node_count = :nc'; $params['nc'] = $input['nodeCount']; }
    if (isset($input['memberCount'])) { $fields[] = 'member_count = :mc'; $params['mc'] = $input['memberCount']; }
    if (isset($input['steelWeightSaved'])) { $fields[] = 'steel_weight_saved = :sw'; $params['sw'] = $input['steelWeightSaved']; }
    if (isset($input['clientOrEngineer'])) { $fields[] = 'client_or_engineer = :client'; $params['client'] = $input['clientOrEngineer']; }
    if (isset($input['challenge'])) { $fields[] = 'challenge = :challenge'; $params['challenge'] = $input['challenge']; }
    if (isset($input['engineeringSolution'])) { $fields[] = 'engineering_solution = :solution'; $params['solution'] = $input['engineeringSolution']; }
    if (isset($input['softwareUsed'])) { $fields[] = 'software_used = :su'; $params['su'] = json_encode($input['softwareUsed']); }
    if (isset($input['keyMetrics'])) { $fields[] = 'key_metrics = :km'; $params['km'] = json_encode($input['keyMetrics']); }
    if (isset($input['featured'])) { $fields[] = 'featured = :featured'; $params['featured'] = $input['featured'] ? 1 : 0; }

    if (!empty($fields)) {
        $sql = "UPDATE projects SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
    }

    $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(formatProjectRow($stmt->fetch()));
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? trim($_GET['id']) : null;
    $input = getJsonInput();
    if (!$id && !empty($input['id'])) $id = $input['id'];
    if (!$id) sendError('Project ID is required', 400);

    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = :id");
    $stmt->execute(['id' => $id]);
    sendResponse(['success' => true]);
}
