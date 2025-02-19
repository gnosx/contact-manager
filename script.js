document.getElementById('create').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'create.html';
});

const urlBase = 'http://contact.youneedtodo.xyz';
const extension = 'php';

let userId = 0;

function doLogin()
{
	console.log("doing login");
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
			alert("Login successful! User ID: " + data.id);
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

	console.log(jsonPayload);
}