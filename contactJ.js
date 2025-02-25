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