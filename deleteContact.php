<?php
    session_start();
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    $inData = json_decode(file_get_contents("php://input"), true);

    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");

    if ($conn->connect_error) {
        die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
    }

    if (!isset($_SESSION["user_id"])) {
        die(json_encode(["error" => "Unauthorized access. Please log in."]));
    }

    $contactId = $conn->real_escape_string($inData["contactId"]);
    $userId = $_SESSION["user_id"]; // Ensure the user is only deleting their own contacts

    // Check if the contact belongs to the logged-in user
    $sql = "DELETE FROM Contacts WHERE ID=? AND UserID=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $contactId, $userId);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => "Contact deleted successfully"]);
    } else {
        echo json_encode(["error" => "Contact not found or you don't have permission"]);
    }

    $stmt->close();
    $conn->close();
?>
