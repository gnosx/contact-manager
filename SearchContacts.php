<?php
	$inData = getRequestInfo();
	
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
		$stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?) AND UserID=?");

        $searchTerm = "%" . $inData["search"] . "%";
		$stmt->bind_param("sssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm, $inData["userId"]);
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