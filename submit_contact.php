<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db_config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request payload.']);
    exit;
}

$requiredFields = ['name', 'email', 'phone', 'projectType', 'preferredDate', 'budget'];
foreach ($requiredFields as $field) {
    if (empty(trim($payload[$field] ?? ''))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit;
    }
}

$name = trim($payload['name']);
$email = filter_var(trim($payload['email']), FILTER_VALIDATE_EMAIL);
$phone = trim($payload['phone']);
$projectType = trim($payload['projectType']);
$preferredDate = trim($payload['preferredDate']);
$budget = trim($payload['budget']);
$message = trim($payload['message'] ?? '');

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address.']);
    exit;
}

try {
    $pdo = getDbConnection();

    $stmt = $pdo->prepare(
        'INSERT INTO inquiries (name, email, phone, project_type, preferred_date, budget, message) VALUES (:name, :email, :phone, :project_type, :preferred_date, :budget, :message)'
    );
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':project_type' => $projectType,
        ':preferred_date' => $preferredDate,
        ':budget' => $budget,
        ':message' => $message,
    ]);

    echo json_encode(['success' => true, 'message' => 'Your booking inquiry has been submitted. Thank you!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to save inquiry. Please try again later.']);
}
