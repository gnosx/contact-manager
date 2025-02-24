<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//ensure user is logged in
if (!isset($_SESSION["user_id"])) {
    die(json_encode(["error" => "Unauthorized access"]));
}

$inData = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$userId = $_SESSION["user_id"]; //get logged-in user ID
$name = $conn->real_escape_string($inData["name"]);
$email = $conn->real_escape_string($inData["email"]);

$sql = "INSERT INTO Contacts (user_id, name, email) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iss", $userId, $name, $email);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["message" => "Contact created successfully"]);
} else {
    echo json_encode(["error" => "Failed to create contact"]);
}

$stmt->close();
$conn->close();
?>
