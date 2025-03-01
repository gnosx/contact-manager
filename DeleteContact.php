<?php
	$inData = getRequestInfo();
	
    // create variables
    $ID = $inData["ID"];

    // create new connection
    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
        exit();
	} 
	else
	{
        // delete contact
        $stmt = $conn->prepare("DELETE from CONTACTS WHERE ID=?");
        $stmt->bind_param("s", $ID);

        if ($stmt->execute()) {
            returnWithInfo($ID);
        } else {
            returnWithError("Error deleting contact");
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