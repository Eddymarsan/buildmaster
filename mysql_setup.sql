-- MySQL setup script for BuildMaster Construction website

CREATE DATABASE IF NOT EXISTS buildmaster CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE buildmaster;

-- Admin users for the admin dashboard (note: current site login is hardcoded to admin/admin123)
CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contact form inquiries submitted by users
CREATE TABLE IF NOT EXISTS inquiries (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  project_type VARCHAR(100) NOT NULL,
  preferred_date DATE NOT NULL,
  budget VARCHAR(100) NOT NULL,
  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional ratings table if you want to persist site ratings
CREATE TABLE IF NOT EXISTS ratings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  user_ip VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example admin user (password should be stored as a secure hash)
-- Replace the password_hash value with the result of:
--   php -r "echo password_hash('admin123', PASSWORD_DEFAULT);"
INSERT IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', '$2y$10$PLACEHOLDER_HASH_REPLACE_ME');
