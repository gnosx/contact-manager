const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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
			firstName = data.firstName;
			lastName = data.lastName;
			userId = data.userId;
			alert("Your Id is " + userId);
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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	

}
