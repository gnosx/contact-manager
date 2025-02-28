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

				if (userId < 1) {
					alert("WRONG");
					//document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				else {
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					alert("Your ID is " + userId + " " + firstName);

					saveCookie();
					readCookie();
					alert("Your ID is " + userId + " " + firstName);

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

//edited readcookie
function readCookie() {
    let cookies = document.cookie.split("; ");
    let userId = -1;

    cookies.forEach(cookie => {
        let [key, value] = cookie.split("=");
        if (key === "userId") {
            userId = parseInt(value);
        }
    });

    return userId;
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
    let userId = readCookie();  //ensure correct userId retrieval

    if (userId < 1) {
        console.error("Invalid userId");
        return;
    }

    let tmp = { userId: userId, search: searchTerm };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                if (!jsonObject.results || jsonObject.results.length === 0) {
                    document.getElementById("contactSearchResult").innerHTML = "<tr><td>No contacts found</td></tr>";
                    return;
                }

                let contactList = jsonObject.results.map(contact => 
                    `<tr>
                        <td>${contact.FirstName} ${contact.LastName}</td>
                        <td>${contact.Phone}</td>
                        <td>${contact.Email}</td>
                    </tr>`).join('');

                document.getElementById("contactSearchResult").innerHTML = contactList;
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }
    };
    xhr.send(jsonPayload);
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
    let searchText = document.getElementById("searchText").value.trim();
    let userId = readCookie();

    if (userId < 1) {
        console.error("Invalid userId, search aborted.");
        return;
    }

    let tmp = { search: searchText, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.php';

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            try {
                let jsonObject = JSON.parse(xhr.responseText);
                let contactList = "";

                if (!jsonObject.results || jsonObject.results.length === 0) {
                    document.getElementById("contactSearchResult").innerHTML = "<tr><td>No matching contacts found</td></tr>";
                    return;
                }

                jsonObject.results.forEach(contact => {
                    contactList += `<tr>
                                        <td>${contact.FirstName} ${contact.LastName}</td>
                                        <td>${contact.Phone}</td>
                                        <td>${contact.Email}</td>
                                    </tr>`;
                });

                document.getElementById("contactSearchResult").innerHTML = contactList;
            } catch (error) {
                console.error("Error parsing search response:", error);
            }
        }
    };
    xhr.send(jsonPayload);
}
