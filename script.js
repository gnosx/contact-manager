const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// listener for logging out
document.getElementById('login-form')?.addEventListener('submit', function (event) {
	event.preventDefault(); // Prevent the form from submitting the traditional way

	// Directly redirect to contacts.html for testing
	const username = document.getElementById('username').value;

	// Save user information in localStorage
	localStorage.setItem('loggedInUser', username);

	// Redirect to contacts.html
	window.location.href = 'contacts.html'; // Change 'contacts.html' to your desired page
});

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId === undefined) {
					alert("WRONG");
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				else {
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					alert("Your ID is " + userId + " " + firstName);

					saveCookie();

					window.location.href = "contacts.html";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doSignup() {
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

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// TODO: user id saving as -1 for every contact added
function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
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

function contactsTable(contacts) {
	let contactDisplay = document.getElementById("contactResult"); 
	contactDisplay.innerHTML = "";
	if(contacts === undefined || contacts.length == 0) {
		contactDisplay.innerHTML = "<p>No contacts</p>";
		return;
	}

	// each contact will generate this div
	contacts.forEach(element => {
		let contactTable = document.createElement("table");

		// contact style
		// contactDiv.className = "contact";

		contactTable.innerHTML = 
			`<tr>
				<th>Name:</th>
				<th>Phone:</th>
				<th>Email:</th>
			</tr>
			<tr>
				<td>${element.FirstName + " " + element.LastName}</td>
				<td>${element.Phone}</td>
				<td>${element.Email}</td>
			</tr>
			`;
		contactDisplay.appendChild(contactTable);
	});
}

function getContacts(userId) {
	let tmp = { userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/GetContacts.' + extension;

	fetch(url, {
		method: "POST",
		body: jsonPayload,
		headers: { "Content-Type": "application/json" }
	})
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return;
		})
		.then(data => {
			console.log(data);
			contactsTable(data);
		})
		.catch(error => {
			console.error("Error:", error);
			alert("Grabbing contacts failed: " + error.message);
		});
}

function addContact() {
	readCookie();
	alert(userId);
	let cFirstName = document.getElementById("firstName").value;
	let cLastName = document.getElementById("lastName").value;
	let cPhoneNumber = document.getElementById("phoneNumber").value;
	let cEmail = document.getElementById("email").value;


	let tmp = { firstName: cFirstName, lastName: cLastName, phoneNumber: cPhoneNumber, email: cEmail, userId: userId };
	// console.log(tmp);
	let jsonPayload = JSON.stringify(tmp);

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
	readCookie();
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
		xhr.onreadystatechange = function () {
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



function removeContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    let tmp = { userId: userId, contactId: contactId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/removeContact.' + extension;

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
            alert("Contact Removed!");
            window.location.reload(); // Refresh the contact list
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Contact removal failed: " + error.message);
    });
}
