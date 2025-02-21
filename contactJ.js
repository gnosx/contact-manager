document.addEventListener("DOMContentLoaded", function () {
    checkSession(); // Verify if user is logged in
    loadContacts(); // Load contacts on page load
});

// ✅ Check if a user session exists
function checkSession() {
    fetch("https://yourdomain.com/LAMPAPI/CheckSession.php")
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                document.getElementById("username-display").textContent = `Hello, ${data.firstName}`;
                document.getElementById("login-link").style.display = "none"; // Hide login link
            } else {
                window.location.href = "index.html"; // Redirect to login if no session exists
            }
        })
        .catch(error => console.error("Session check failed:", error));
}

// ✅ Fetch and Display Contacts for Logged-in User
function loadContacts() {
    fetch("https://yourdomain.com/LAMPAPI/GetContacts.php")
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Error: " + data.error);
            } else {
                displayContacts(data);
            }
        })
        .catch(error => console.error("Failed to load contacts:", error));
}

// ✅ Display Contacts in HTML
function displayContacts(contacts) {
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; // Clear existing contacts

    contacts.forEach(contact => {
        let contactItem = document.createElement("li");
        contactItem.textContent = `${contact.name} - ${contact.email}`;
        contactList.appendChild(contactItem);
    });
}

// ✅ Logout Function: Clears Session and Redirects to Login
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-link");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();

            fetch("https://yourdomain.com/LAMPAPI/Logout.php")
                .then(response => response.json())
                .then(data => {
                    console.log("Logout successful:", data);
                    window.location.href = "index.html"; // Redirect to login page
                })
                .catch(error => console.error("Logout failed:", error));
        });
    }
});
