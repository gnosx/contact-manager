<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$inData = json_decode(file_get_contents("php://input"), true);

$conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");

if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$login = $conn->real_escape_string($inData["login"]);
$password = $inData["password"];

$sql = "SELECT ID, firstName, lastName FROM Users WHERE Login=? AND Password=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $login, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $_SESSION["user_id"] = $row["ID"]; //store user ID in session
    $_SESSION["username"] = $login;    //store username in session

    returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
} else {
    echo json_encode(["error" => "Invalid login credentials"]);
}

function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}


$conn->close();
?>