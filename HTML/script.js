document.getElementById('create').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'create.html';
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send data to the server
    fetch('http://your-php-server-url/login.php', { // Update URL to match your PHP endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: username, password: password }), // Ensure keys match PHP script
    })
    .then(response => response.json())
    .then(data => {
        if (data.id > 0) { // Check if user ID is greater than 0
            document.getElementById('message').textContent = 'Login successful!';
            document.getElementById('message').style.color = 'green';
            localStorage.setItem('loggedInUser', username);
            window.location.href = 'contacts.html';
        } else {
            document.getElementById('message').textContent = data.error || 'Invalid username or password.';
            document.getElementById('message').style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
