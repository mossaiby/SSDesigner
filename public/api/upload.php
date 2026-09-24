<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    sendError('Method not allowed. Only POST is supported for file uploads.', 405);
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errCode = isset($_FILES['file']['error']) ? $_FILES['file']['error'] : 'No file uploaded';
    sendError('Upload failed with error code: ' . $errCode, 400);
}

$file = $_FILES['file'];
$maxSize = 50 * 1024 * 1024; // 50MB
if ($file['size'] > $maxSize) {
    sendError('File exceeds maximum size of 50MB', 400);
}

// Validate file extension and MIME type
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'mov', 'pdf', 'zip'];
$originalName = basename($file['name']);
$extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    sendError('File type not permitted. Allowed: ' . implode(', ', $allowedExtensions), 400);
}

// Ensure upload directory exists (located in public/uploads or public_html/uploads)
$targetDir = dirname(__DIR__) . '/uploads';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

// Create unique, clean filename
$cleanName = preg_replace('/[^a-zA-Z0-9_\.-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
$newFilename = time() . '_' . substr(md5(uniqid()), 0, 8) . '_' . $cleanName . '.' . $extension;
$destination = $targetDir . '/' . $newFilename;

if (!move_uploaded_file($file['tmp_name'], $destination)) {
    sendError('Failed to move uploaded file to destination directory', 500);
}

// Return relative public URL for frontend display and storage
$publicUrl = '/uploads/' . $newFilename;

sendResponse([
    'success' => true,
    'filename' => $newFilename,
    'url' => $publicUrl,
    'size' => $file['size'],
    'mime' => $file['type']
], 201);
