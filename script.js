const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;

function doLogin()
{
	userId = 0;
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	fetch(url, {
		method: "POST",
		body: jsonPayload,
		headers: { "Content-Type": "application/json" }
	})
	// request err
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	// success
	.then(data => {
		if (data.error === "") {
			window.location.href = "contacts.html";
		} else {
			alert("Error: " + data.error);
		}
	})
	// generic error
	.catch(error => {
		console.error("Error:", error);
		alert("Login failed: " + error.message); // Show user feedback
	});
}

function doSignup()
{
	userId = 0;
	
	let userName = document.getElementById("firstName").value;
	let userPass = document.getElementById("lastName").value;
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;

	let tmp = {firstName:firstName, lastName:lastName, login:userName,password:userPass};	// change "login" and "password" to match php
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/Create.' + extension;

	fetch(url, {
		method: "POST",
		body: jsonPayload,
		headers: { "Content-Type": "application/json" }
	})
	// request err
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	// success
	.then(data => {
		if (data.error === "") {
			alert("Account Created!");
			window.location.href = "index.html";
		} else {
			alert("Error: " + data.error);
		}
	})
	// generic error
	.catch(error => {
		console.error("Error:", error);
		alert("Login failed: " + error.message); // Show user feedback
	});
}