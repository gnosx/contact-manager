const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// listener for logging out
document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Directly redirect to contacts.html for testing
    const username = document.getElementById('username').value;

    // Save user information in localStorage
    localStorage.setItem('loggedInUser', username);

    // Redirect to contacts.html
    window.location.href = 'contacts.html'; // Change 'contacts.html' to your desired page
});

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					alert("WRONG");
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
				alert("Your ID is " + userId + " " + firstName);

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup()
{
	userId = 0;
	
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let userName = document.getElementById("userName").value;
	let userPass = document.getElementById("userPass").value;

	// Include all fields to match PHP expectations
	let tmp = { firstName: firstName, lastName: lastName, login: userName, password: userPass };
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Create.' + extension;

	fetch(url, {
		method: "POST",
		body: jsonPayload,
		headers: { "Content-Type": "application/json" }
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.error === "") {
			alert("Account Created!");
			window.location.href = "index.html";
		} else {
			alert("Error: " + data.error);
		}
	})
	.catch(error => {
		console.error("Error:", error);
		alert("Sign up failed: " + error.message);
	});
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = `userId=${userId}; expires=${date.toGMTString()}; path=/`;
}

// TODO: user id saving as -1 for every contact added
function readCookie()
{
	let data = document.cookie.split(";");
	for(var i = 0; i < data.length; i++) 
	{
		let thisOne = cookies[i].trim().split("=");
		if( thisOne[0] === "userId" )
		{
			// return userId
			return parseInt(thisOne[1]);
		}
	}

	return -1;
}

// Function to open the pop-up
function openPopup() {
    document.getElementById('popupContainer').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Function to close the pop-up
function closePopup() {
    document.getElementById('popupContainer').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function getContacts(searchTerm = "") {
    let userId = readCookie("userId");

    let tmp = { userId: userId, search: searchTerm };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.php';  // URL pointing to your PHP script

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let contactList = "";

                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += `<tr>
                                        <td>${jsonObject.results[i].FirstName} ${jsonObject.results[i].LastName}</td>
                                        <td>${jsonObject.results[i].Phone}</td>
                                        <td>${jsonObject.results[i].Email}</td>
                                     </tr>`;
                }
                document.getElementById("contactSearchResult").innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}


function addContact()
{
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;
	let userId = readCookie();
	console.log(userId);

	let tmp = { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email: email, userId: userId };
	// console.log(tmp);
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	fetch(url, {
		method: "POST",
		body: jsonPayload,
		headers: { "Content-Type": "application/json" }
	})
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	.then(data => {
		if (data.error === "") {
			alert("Contact Added!");
			window.location.href = "contacts.html";
		} else {
			alert("Error: " + data.error);
		}
	})
	.catch(error => {
		console.error("Error:", error);
		alert("Contact creation failed: " + error.message);
	});
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    
    let contactList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += "<tr><th>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "</th><th>" +
                        jsonObject.results[i].Phone + "</th><th>" +
                        jsonObject.results[i].Email + "</th></tr>";
                }
                
                document.getElementById("contactSearchResult").innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}