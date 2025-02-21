
<?php

	$inData = getRequestInfo();
	
	$id = 0;

	$conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=? AND Password=?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row['ID'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $id )
	{
		$retValue = '{"id":' . $id . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

$inData = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");

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
        //store user session
        $_SESSION["user_id"] = $row["id"];
        $_SESSION["first_name"] = $row["firstName"];
        $_SESSION["last_name"] = $row["lastName"];

        echo json_encode([
            "id" => $row["id"],
            "firstName" => $row["firstName"],
            "lastName" => $row["lastName"],
            "message" => "Login successful"
        ]);
    } else {
        echo json_encode(["error" => "Invalid password"]);
    }
} else {
    echo json_encode(["error" => "User not found"]);
}

$conn->close();
?>

