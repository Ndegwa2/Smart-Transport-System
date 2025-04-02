const signInButton = document.getElementById('sign-in-button');
const enrollButton = document.getElementById('enroll-button');
const accountIcon = document.querySelector('.account-icon');
let isLoggedIn = false;

// Function to update UI based on login status
function updateUI() {
    if (isLoggedIn) {
        signInButton.textContent = 'Sign Out';
        enrollButton.style.display = 'none';
        accountIcon.style.display = 'block';
    } else {
        signInButton.textContent = 'Sign In';
        enrollButton.style.display = 'inline-block';
        accountIcon.style.display = 'none';
    }
}

// Initial UI update
updateUI();

signInButton.addEventListener('click', () => {
    if (isLoggedIn) {
        // Implement sign-out logic here
        isLoggedIn = false;
        updateUI();
        alert('Signed out');
    } else {
        // Implement sign-in logic here
        alert('Sign In button clicked');
    }
});

enrollButton.addEventListener('click', () => {
    // Implement enroll logic here
    alert('Enroll button clicked');
});

accountIcon.addEventListener('click', () => {
    // Implement account logic here
    alert('Account icon clicked');
});