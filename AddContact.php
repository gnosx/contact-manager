<?php
	$inData = getRequestInfo();
	
    // create variables
	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];

    // create new connection
    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // check if contact already exists
        $stmt = $conn->prepare("SELECT ID FROM Contacts WHERE Login=?");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0)
        {
            returnWithError("Contact already exists");
        }
        else
        {
            // insert new contact
            $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
            
            if ($stmt->execute()) {
                returnWithInfo($conn->insert_id);
            } else {
                returnWithError("Error inserting user");
            }
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