-- ==============================================================
-- SSDesigner Production MySQL Database Schema
-- Run this in cPanel phpMyAdmin or visit /api/setup.php to auto-create
-- ==============================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(64) NOT NULL DEFAULT 'administrator',
  `last_login` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `software` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `projects` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
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
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `media` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `type` VARCHAR(32) NOT NULL DEFAULT 'photo',
  `title` VARCHAR(255) NOT NULL,
  `caption` TEXT,
  `url` TEXT NOT NULL,
  `thumbnail_url` TEXT,
  `duration` VARCHAR(32) DEFAULT NULL,
  `target_id` VARCHAR(64) DEFAULT NULL,
  `target_type` VARCHAR(32) DEFAULT NULL,
  `technical_note` TEXT,
  `dimensions` VARCHAR(64) DEFAULT NULL,
  `tags` LONGTEXT,
  `created_at` VARCHAR(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `organization` VARCHAR(255),
  `inquiry_type` VARCHAR(128),
  `message` TEXT,
  `software_interest` VARCHAR(255),
  `status` VARCHAR(64) DEFAULT 'new',
  `submitted_at` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `user_id` VARCHAR(64),
  `user_name` VARCHAR(255),
  `action` VARCHAR(255),
  `target` VARCHAR(255),
  `timestamp` VARCHAR(64),
  `ip_address` VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
