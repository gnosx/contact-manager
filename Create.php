<?php

    $inData = getRequestInfo();
    
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $login = $inData["login"];
    $password = $inData["password"];
    
    $conn = new mysqli("localhost", "Group4", "fouristhebest", "ContactMan");    
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
        exit();
    }
    else
    {
        // Check if the username already exists
        $stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0)
        {
            returnWithError("Username already taken");
            $stmt->close();
            $conn->close();
            exit();
        }
        else
        {
            // Insert new user
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
        $retValue = '{"id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $id )
    {
        $retValue = '{"id":' . $id . ',"error":""}';
        sendResultInfoAsJson( $retValue );
    }
    
?>

