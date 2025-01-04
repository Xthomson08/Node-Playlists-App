document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const loginMessage = document.getElementById('loginMessage');
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            loginMessage.textContent = 'Login successful!';
            setTimeout(() => {
                location.href = '/logged-inView';
            }, 1000);
        } else {
            loginMessage.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        loginMessage.textContent = 'An error occurred while logging in.';
    }

    loginForm.reset();
});
