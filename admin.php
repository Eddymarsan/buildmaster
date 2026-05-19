<?php
session_start();

// Fixed admin credentials: only these values can log in to the dashboard.
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

$loginError = '';

if (isset($_GET['logout'])) {
    session_unset();
    session_destroy();
    header('Location: admin.php');
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $_SESSION['adminAuthenticated'] = true;
        header('Location: admin.php');
        exit;
    }

    $loginError = 'Invalid username or password.';
}

$authenticated = !empty($_SESSION['adminAuthenticated']);
$contacts = [];
$dbError = '';

if ($authenticated) {
    require_once __DIR__ . '/db_config.php';

    try {
        $pdo = getDbConnection();
        $stmt = $pdo->query(
            'SELECT id, name, email, phone, project_type, preferred_date, budget, message, created_at FROM inquiries ORDER BY created_at DESC'
        );
        $contacts = $stmt->fetchAll();
    } catch (PDOException $e) {
        $dbError = 'Unable to load inquiries. Please verify your database connection.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - BuildMaster Construction</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        body { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; font-family: 'Roboto', sans-serif; margin: 0; }
        header { position: fixed; width: 100%; top: 0; left: 0; display: flex; justify-content: space-between; align-items: center; padding: 15px 60px; background: linear-gradient(135deg, #007bff, #0056b3); box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000; }
        header .logo img { width: 140px; max-width: 100%; height: auto; display: block; }
        nav ul { display: flex; list-style: none; margin: 0; padding: 0; }
        nav ul li { margin-left: 30px; }
        nav ul li a { text-decoration: none; color: white; font-weight: 500; }
        .admin-container { max-width: 1400px; margin: 140px auto 40px; padding: 0 20px; }
        .admin-header { text-align: center; margin-bottom: 40px; }
        .admin-header h1 { font-size: 2.5em; color: #333; margin-bottom: 10px; }
        .admin-header p { font-size: 1.1em; color: #555; }
        .table-wrapper { background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .reports-table { width: 100%; border-collapse: collapse; }
        .reports-table th, .reports-table td { padding: 18px 16px; text-align: left; border-bottom: 1px solid #e0e0e0; }
        .reports-table thead { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .reports-table tbody tr:hover { background: #f8f9ff; }
        .status-badge { display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 600; }
        .empty-state, .login-panel { background: white; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.1); padding: 40px; text-align: center; }
        .empty-state i { font-size: 3em; color: #667eea; margin-bottom: 20px; }
        .login-panel form { display: grid; gap: 18px; max-width: 420px; margin: 0 auto; text-align: left; }
        .login-panel label { display: block; margin-bottom: 8px; font-weight: 600; color: #333; }
        .login-panel input { width: 100%; padding: 14px 16px; border: 1px solid #d1d5db; border-radius: 10px; font-size: 1rem; }
        .login-panel button { width: 100%; padding: 14px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; }
        .login-error { color: #c62828; font-weight: 600; }
        .logout-link { color: #ffdd57; font-weight: 600; }
        @media (max-width: 768px) { header { padding: 15px 24px; } header .logo img { width: 120px; } .admin-container { margin-top: 120px; } .reports-table th, .reports-table td { padding: 12px 10px; } }
    </style>
</head>
<body>
    <header>
        <div class="logo">
            <a href="Index.html"><img src="Images/JuPet_logo.png" alt="BuildMaster Construction logo"></a>
        </div>
        <nav>
            <ul>
                <li><a href="Index.html">Back to Site</a></li>
                <?php if ($authenticated): ?>
                <li><a href="admin.php?logout=1" class="logout-link"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                <?php endif; ?>
            </ul>
        </nav>
    </header>

    <div class="admin-container">
        <?php if (!$authenticated): ?>
            <div class="login-panel">
                <h1>Admin Login</h1>
                <p>Sign in to view booking inquiries submitted through the website.</p>
                <?php if ($loginError): ?>
                    <div class="login-error"><?php echo htmlspecialchars($loginError, ENT_QUOTES, 'UTF-8'); ?></div>
                <?php endif; ?>
                <form method="post" action="admin.php">
                    <label for="username">Username</label>
                    <input id="username" name="username" type="text" required>
                    <label for="password">Password</label>
                    <input id="password" name="password" type="password" required>
                    <button type="submit" name="login">Login</button>
                </form>
            </div>
        <?php else: ?>
            <?php if ($dbError): ?>
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p><?php echo htmlspecialchars($dbError, ENT_QUOTES, 'UTF-8'); ?></p>
                </div>
            <?php else: ?>
            <div class="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Client booking inquiries submitted through the contact form.</p>
            </div>
            <?php if (empty($contacts)): ?>
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>No booking reports found yet.</p>
                </div>
            <?php else: ?>
                <div class="table-wrapper">
                    <table class="reports-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Project Type</th>
                                <th>Preferred Date</th>
                                <th>Budget</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($contacts as $report): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($report['id'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['email'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['phone'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['project_type'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['preferred_date'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['budget'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                    <td><?php echo htmlspecialchars($report['message'] ?? '', ENT_QUOTES, 'UTF-8'); ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
            <?php endif; ?>
        <?php endif; ?>
    </div>
</body>
</html>
