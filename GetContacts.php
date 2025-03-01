<?php
	$inData = getRequestInfo();
	
    // create variables
    $userId = $inData["userId"];

    // create new connection
    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
        exit();
	} 
	else
	{
        // grab contacts
        $stmt = $conn->prepare("SELECT FirstName, LastName, Email, ID FROM Contacts WHERE UserID=?");
        $stmt->bind_param("s", $userId);
        $stmt->execute();
        $result = $stmt->get_result();

        // arr to hold contacts
        $contacts = [];

        // put contacts into array
        while($row = $result->fetch_assoc()) {
            $contacts[] = $row;
        }

        // check if contacts is populated
        if(count($contacts) > 0) {
            returnWithInfo($contacts);
        } else {
            returnWithError("No contacts found");
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

    function returnWithInfo($contacts) {
        $retValue = json_encode(["contacts" => $contacts]);
        sendResultInfoAsJson($retValue);
    }
?>