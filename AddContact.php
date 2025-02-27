<?php
	$inData = getRequestInfo();
	
    // create variables
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $phoneNumber = $inData["phoneNumber"];
    $email = $inData["email"];
    $userId = $inData["userId"];

    // create new connection
    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
    // TODO: check if contact already exists
	else
	{
        // insert contact
        $stmt = $conn->prepare("INSERT INTO Contacts (UserID, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("issss", $userId, $firstName, $lastName, $phoneNumber, $email);

        if($stmt->execute())
        {
            returnWithError("")
        }
        else
        {
            returnWithError("Error adding contact: " . $stmt->error);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>