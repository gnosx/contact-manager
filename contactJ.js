// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user information from localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    // Display username if user is logged in
    if (loggedInUser) {
        document.getElementById('username-display').textContent = `Hello, ${loggedInUser}`;
        document.getElementById('login-link').style.display = 'none'; // Hide login link if user is logged in
    }
});

document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Directly redirect to contacts.html for testing
    const username = document.getElementById('username').value;

    // Save user information in localStorage
    localStorage.setItem('loggedInUser', username);

    // Redirect to contacts.html
    window.location.href = 'contacts.html'; // Change 'contacts.html' to your desired page
});

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

function addContact()
{
	let newColor = document.getElementById("contactText").value;
	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {contact:newContact,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
	
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("contactSearchResult").innerHTML = "";
    
    let contactList = "";

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                
                for (let i = 0; i < jsonObject.results.length; i++) {
                    contactList += "<p>" + jsonObject.results[i].FirstName + " " + jsonObject.results[i].LastName + "<br>" +
                        jsonObject.results[i].Phone + "<br>" +
                        jsonObject.results[i].Email + "</p>";
                }
                
                document.getElementById("contactSearchResult").innerHTML = contactList;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}
