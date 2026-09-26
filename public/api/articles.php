<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if (!$pdo) {
    sendError('Database offline', 503);
}

// Ensure table exists safely without 767-byte index overflow
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `articles` (
      `id` VARCHAR(64) NOT NULL PRIMARY KEY,
      `title` VARCHAR(255) NOT NULL,
      `slug` VARCHAR(191) NOT NULL,
      `category` VARCHAR(128) NOT NULL,
      `read_time` VARCHAR(64) DEFAULT '5 min read',
      `excerpt` TEXT,
      `content` LONGTEXT,
      `cover_image` TEXT,
      `author_name` VARCHAR(128) DEFAULT 'SSDesigner Lead Engineer',
      `author_role` VARCHAR(128) DEFAULT 'Chief Scientist',
      `tags` LONGTEXT,
      `published_at` VARCHAR(64),
      `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX `idx_articles_slug` (`slug`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (Throwable $e) {
    // Non-fatal: table may already exist or DDL restricted
}

function formatArticleRow($row) {
    if (!$row) return null;
    return [
        'id' => $row['id'],
        'title' => $row['title'],
        'slug' => $row['slug'],
        'category' => $row['category'],
        'readTime' => $row['read_time'] ?: '5 min read',
        'excerpt' => $row['excerpt'] ?: '',
        'content' => $row['content'] ?: '',
        'coverImage' => $row['cover_image'] ?: '/src/assets/images/hero_space_structure_1790188515133.jpg',
        'author' => [
            'name' => $row['author_name'] ?: 'Engineering Analyst',
            'role' => $row['author_role'] ?: 'Structural Engineering Specialist'
        ],
        'tags' => json_decode($row['tags'] ?: '[]', true) ?: [],
        'publishedAt' => $row['published_at'] ?: date('Y-m-d')
    ];
}

try {
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id OR slug = :id");
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            if (!$row) sendError('Article not found', 404);
            sendResponse(formatArticleRow($row));
        } else {
            $stmt = $pdo->query("SELECT * FROM articles ORDER BY created_at DESC");
            $rows = $stmt->fetchAll();
            sendResponse(array_map('formatArticleRow', $rows));
        }
    }

    if ($method === 'POST') {
        $input = getJsonInput();
        if (empty($input['title'])) sendError('Article title is required', 400);

        $id = !empty($input['id']) ? $input['id'] : 'post_' . uniqid();
        $title = trim($input['title']);
        $rawSlug = !empty($input['slug']) ? $input['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title), '-'));
        $slug = substr($rawSlug ?: ('post-' . substr(uniqid(), 0, 8)), 0, 180);
        $category = !empty($input['category']) ? $input['category'] : 'Computational Mechanics';
        $readTime = !empty($input['readTime']) ? $input['readTime'] : '6 min read';
        $excerpt = !empty($input['excerpt']) ? $input['excerpt'] : '';
        $content = !empty($input['content']) ? $input['content'] : '';
        $cover = !empty($input['coverImage']) ? $input['coverImage'] : '';
        $authorName = !empty($input['author']['name']) ? $input['author']['name'] : 'Lead Structural Engineer';
        $authorRole = !empty($input['author']['role']) ? $input['author']['role'] : 'Senior Researcher';
        $tags = json_encode(!empty($input['tags']) ? $input['tags'] : []);
        $publishedAt = !empty($input['publishedAt']) ? $input['publishedAt'] : date('Y-m-d');

        $stmt = $pdo->prepare("INSERT INTO articles 
            (id, title, slug, category, read_time, excerpt, content, cover_image, author_name, author_role, tags, published_at) 
            VALUES (:id, :title, :slug, :category, :rt, :excerpt, :content, :cover, :aname, :arole, :tags, :pub)");

        $stmt->execute([
            'id' => $id, 'title' => $title, 'slug' => $slug, 'category' => $category,
            'rt' => $readTime, 'excerpt' => $excerpt, 'content' => $content,
            'cover' => $cover, 'aname' => $authorName, 'arole' => $authorRole,
            'tags' => $tags, 'pub' => $publishedAt
        ]);

        $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id");
        $stmt->execute(['id' => $id]);
        sendResponse(formatArticleRow($stmt->fetch()), 201);
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        $input = getJsonInput();
        if (!$id && !empty($input['id'])) $id = $input['id'];
        if (!$id) sendError('Article ID is required', 400);

        $fields = [];
        $params = ['id' => $id];

        if (isset($input['title'])) { $fields[] = 'title = :title'; $params['title'] = $input['title']; }
        if (isset($input['slug'])) { $fields[] = 'slug = :slug'; $params['slug'] = substr($input['slug'], 0, 180); }
        if (isset($input['category'])) { $fields[] = 'category = :category'; $params['category'] = $input['category']; }
        if (isset($input['readTime'])) { $fields[] = 'read_time = :rt'; $params['rt'] = $input['readTime']; }
        if (isset($input['excerpt'])) { $fields[] = 'excerpt = :excerpt'; $params['excerpt'] = $input['excerpt']; }
        if (isset($input['content'])) { $fields[] = 'content = :content'; $params['content'] = $input['content']; }
        if (isset($input['coverImage'])) { $fields[] = 'cover_image = :cover'; $params['cover'] = $input['coverImage']; }
        if (isset($input['author']['name'])) { $fields[] = 'author_name = :aname'; $params['aname'] = $input['author']['name']; }
        if (isset($input['author']['role'])) { $fields[] = 'author_role = :arole'; $params['arole'] = $input['author']['role']; }
        if (isset($input['tags'])) { $fields[] = 'tags = :tags'; $params['tags'] = json_encode($input['tags']); }

        if (!empty($fields)) {
            $sql = "UPDATE articles SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }

        $stmt = $pdo->prepare("SELECT * FROM articles WHERE id = :id");
        $stmt->execute(['id' => $id]);
        sendResponse(formatArticleRow($stmt->fetch()));
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? trim($_GET['id']) : null;
        $input = getJsonInput();
        if (!$id && !empty($input['id'])) $id = $input['id'];
        if (!$id) sendError('Article ID is required', 400);

        $stmt = $pdo->prepare("DELETE FROM articles WHERE id = :id");
        $stmt->execute(['id' => $id]);
        sendResponse(['success' => true]);
    }
} catch (Throwable $e) {
    sendError('Database operation failed: ' . $e->getMessage(), 500);
}
