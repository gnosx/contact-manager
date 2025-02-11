// script.js
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    window.location.href = 'contacts.html';
    /*// Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send data to the server
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('message').textContent = 'Login successful!';
            document.getElementById('message').style.color = 'green';
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'contacts.html';
        } else {
            document.getElementById('message').textContent = 'Invalid username or password.';
            document.getElementById('message').style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });*/
});
