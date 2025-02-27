<?php
	session_start();

	header("Access-Control-Allow-Origin: *");
	header("Cotnent-Type: application/json; charset=UTF-8");

	$inData = json_decode(file_get_contents('php://input'), true);
	
	$searchResults = "";
	$searchCount = 0;

    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        // partial search
		$stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE (Phone LIKE ? OR FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ?) AND UserID=?");

        $searchTerm = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssssi", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"Phone":"' . $row["Phone"] . '","FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Email":"' . $row["Email"] . '"}';
		}
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
        $retValue = '{"results":[],"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson( $retValue );
	}
	
 . '],"error":""}';
        sendResultInfoAsJson( $retValue );
	}
	
?>