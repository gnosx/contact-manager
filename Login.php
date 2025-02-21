<?php
session_start(); // Start session

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$inData = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "your_db_user", "your_db_password", "your_db_name");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$login = $conn->real_escape_string($inData["login"]);
$password = $inData["password"];

$sql = "SELECT id, firstName, lastName, password FROM Users WHERE login=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $login);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row["password"])) {
        $_SESSION["user_id"] = $row["id"]; // Store user session

        echo json_encode(["id" => $row["id"], "message" => "Login successful"]);
    } else {
        echo json_encode(["error" => "Invalid password"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}

$conn->close();
?>
