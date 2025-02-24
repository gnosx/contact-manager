<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

//ensure user is logged in
if (!isset($_SESSION["user_id"])) {
    die(json_encode(["error" => "Unauthorized access"]));
}

$conn = new mysqli("34.205.154.206", "Group4", "fouristhebest", "ContactMan");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$userId = $_SESSION["user_id"]; //get logged-in user ID

$sql = "SELECT id, name, email FROM Contacts WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$contacts = [];
while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

echo json_encode($contacts);

$conn->close();
?>
