const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let isAdd = 1;	// variable for checking if add or edit was clicked
let IDforEdit = 0;

var popup = document.getElementById("popup");
var triggerButton = document.getElementById("triggerButton");
var close = document.getElementsByClassName("close")[0];

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
					document.getElementById('error-message').style.display = 'block';
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				else {
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;

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
				document.getElementById("popup-message").textContent = "Account Created!";
    	    	popupContainer.style.display = "block";
				window.location.href = "index.html";
			} else {
				document.getElementById("popup-message").textContent = "Error: " + data.error;
    	    	popupContainer.style.display = "block";
			}
		})
		.catch(error => {
			console.error("Error:", error);
			document.getElementById("popup-message").textContent = "Sign up failed: " + error.message;
    	    popupContainer.style.display = "block";
		});
}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "userId=" + userId + ";" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(";");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}
}

// Function to open the pop-up
function openPopup(val) {
	isAdd = val;
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
    
    if(!contacts || contacts.length == 0) {
        contactDisplay.innerHTML = "<p>No contacts</p>";
        return;
    }

    // create the table and append the header
    let contactTable = document.createElement("table");
    contactTable.innerHTML = `
    <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Email</th>
		<th>Actions</th>
    </tr>
    `;
    contactDisplay.appendChild(contactTable);

    // loop through each contact and add a row for each
    contacts.forEach(element => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${element.FirstName} ${element.LastName}</td>
            <td>${element.Phone}</td>
            <td>${element.Email}</td>
			<td>
				<div style="display: flex; gap: 7px; justify-content: center; align-items: center;">
					<button style="padding: 5px 10px;" onclick="loadContact('${element.FirstName}', '${element.LastName}', '${element.Email}', '${element.Phone}', '${element.ID}')">Edit</button>
					<button style="padding: 5px 10px;" onclick="deleteContact(${element.ID})">Delete</button>
		  		</div>
		  	</td>
        `;
        contactTable.appendChild(row);
    });
}

function getContacts() {
	readCookie();
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
			return response.json();
		})
		.then(data => {
			contactsTable(data.contacts);
		})
		.catch(error => {
			console.error("Error:", error);
		});
}

function addContact() {
	readCookie();
	let cFirstName = document.getElementById("firstName").value;
	let cLastName = document.getElementById("lastName").value;
	let cPhoneNumber = document.getElementById("phoneNumber").value;
	let cEmail = document.getElementById("email").value;

	// check if email if valid
	if (!cEmail.includes('@')) {
		document.getElementById("popup-message").textContent = "Error: " + data.error;
    	popupContainer.style.display = "block";
        return;
    }

	let tmp = { firstName: cFirstName, lastName: cLastName, phoneNumber: cPhoneNumber, email: cEmail, userId: userId };
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
				document.getElementById('add-message').style.display = 'block';
    	    	popupContainer.style.display = "block";
				loadContact('${element.FirstName}', '${element.LastName}', '${element.Email}', '${element.Phone}', '${element.ID}');
			} else {
				document.getElementById("popup-message").textContent = "Error: " + data.error;
    	    	popupContainer.style.display = "block";
			}
		})
		.catch(error => {
			console.error("Error:", error);
		});
}

function searchContact() {
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactResult").innerHTML = "";

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

				contactsTable(jsonObject.contacts);
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("contactResult").innerHTML = err.message;
	}
}

function deleteContact(contactId) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    let tmp = { ID: contactId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

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
			document.getElementById("popup-message").textContent = "Contact Removed!";
    	    popupContainer.style.display = "block";
			loadContact('${element.FirstName}', '${element.LastName}', '${element.Email}', '${element.Phone}', '${element.ID}');
        } else {
			document.getElementById("popup-message").textContent = "Error: " + data.error;
    	    popupContainer.style.display = "block";
        }
    })
    .catch(error => {
        console.error("Error:", error);
		document.getElementById("popup-message").textContent = "Contact removal failed: " + error.message;
    	popupContainer.style.display = "block";
    });

	window.location.href = "contacts.html";
}

function loadContact(firstName, lastName, email, phoneNumber, ID) {
	let first_name = document.getElementById("firstName");
	let last_name = document.getElementById("lastName");
	let email_label = document.getElementById("email");
	let phone_num = document.getElementById("phoneNumber");

	first_name.value = firstName;
	last_name.value = lastName;
	email_label.value = email;
	phone_num.value = phoneNumber;
	IDforEdit = ID;

	openPopup(0);
}

function editContact() {
	let cFirstName = document.getElementById("firstName").value;
	let cLastName = document.getElementById("lastName").value;
	let cPhoneNumber = document.getElementById("phoneNumber").value;
	let cEmail = document.getElementById("email").value;

	let tmp = { firstName: cFirstName, lastName: cLastName, phoneNumber: cPhoneNumber, email: cEmail, ID: IDforEdit };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/EditContact.' + extension;

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
				document.getElementById("popup-message").textContent = "Contact Edited!";
    			popupContainer.style.display = "block";
				window.location.href = "contacts.html";
			} else {
				document.getElementById("popup-message").textContent = "Error: " + data.error;
    			popupContainer.style.display = "block";
			}
		})
		.catch(error => {
			console.error("Error:", error);
			document.getElementById("popup-message").textContent = "Contact edit failed: " + error.message;
    		popupContainer.style.display = "block";
		});
}

function updateContact() {
	// check isAdd
	if(isAdd == 0) {
		editContact();
	} else if(isAdd == 1) {
		addContact();
	}
}