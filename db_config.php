<?php
// Database configuration for Render PostgreSQL

$host = getenv('DB_HOST') ?: 'dpg-d86caln7f7vs73931vjg-a';
$dbname = getenv('DB_NAME') ?: 'buildmaster_5g1n';
$username = getenv('DB_USER') ?: 'buildmaster_user';
$password = getenv('DB_PASS') ?: 'bSZGyrQV2MXLM9y7NEFX35HXhp93Shr4';
$port = getenv('DB_PORT') ?: '5432';

$dsn = "pgsql:host=$host;port=$port;dbname=$dbname;";

try {
    $conn = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $conn;
} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>
