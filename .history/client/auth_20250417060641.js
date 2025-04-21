const signInButton = document.getElementById('sign-in-button');
const enrollButton = document.getElementById('enroll-button');
const accountIcon = document.querySelector('.account-icon');
let isLoggedIn = false;
const registrationForm = document.getElementById('registration-form');
const loginForm = document.getElementById('login-form');

// Function to update UI based on login status
function updateUI(userName = null) {
    if (isLoggedIn) {
        signInButton.textContent = 'Sign Out';
        enrollButton.style.display = 'none';
        accountIcon.style.display = 'block';
        accountIcon.textContent = userName;
    } else {
        signInButton.textContent = 'Sign In';
        enrollButton.style.display = 'inline-block';
        accountIcon.style.display = 'none';
        accountIcon.textContent = '';
    }
}

// Function to redirect user based on category
function redirectToCategory(category) {
    switch (category) {
        case 'administrator':
            window.location.href = 'admin_administrator.html';
            break;
        case 'booking_manager':
            window.location.href = 'admin_booking_manager.html';
            break;
        case 'fleet_manager':
            window.location.href = 'admin_fleet_manager.html';
            break;
        case 'accountant':
            window.location.href = 'admin_accountant.html';
            break;
        case 'passenger':
        default:
            window.location.href = 'routes.html';
            break;
    }
}

// Initial UI update
updateUI();

// Event listeners for showing/hiding forms
enrollButton.addEventListener('click', function() {
    document.getElementById('registration-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
});

signInButton.addEventListener('click', function() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('registration-form').style.display = 'none';
});

// Login event listener
document.getElementById('login-button').addEventListener('click', function() {
    console.log('Login button clicked');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            isLoggedIn = true;
            localStorage.setItem('token', data.token); // Store the token
            localStorage.setItem('category', data.category); // Store the category
            updateUI(data.name);
            alert('Sign in successful!');
            redirectToCategory(data.category); // Redirect based on category
        } else {
            isLoggedIn = false;
            updateUI();
            alert('Sign in failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during sign in.');
    });
});

// Registration event listener
document.getElementById('register-button').addEventListener('click', function() {
    console.log('Register button clicked');
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const category = document.getElementById('reg-category').value; // Get selected category

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name, email: email, password: password, category: category }) // Send category to backend
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    });
});