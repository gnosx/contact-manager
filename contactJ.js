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

//display Contacts in HTML
function displayContacts(contacts) {
    let contactList = document.getElementById("contact-list");
    contactList.innerHTML = ""; //clear existing contacts

    contacts.forEach(contact => {
        let contactItem = document.createElement("li");
        contactItem.textContent = `${contact.name} - ${contact.email}`;
        contactList.appendChild(contactItem);
    });
}

//logout function
document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById("logout-link");

    if (logoutButton) {
        logoutButton.addEventListener("click", function (event) {
            event.preventDefault();

            fetch("https://yourdomain.com/LAMPAPI/Logout.php")
                .then(response => response.json())
                .then(() => {
                    window.location.href = "index.html"; //redirect to login page
                })
                .catch(error => console.error("Logout failed:", error));
        });
    }
});
