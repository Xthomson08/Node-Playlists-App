document.getElementById('sign-upForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const message = document.getElementById('message');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
            message.textContent = 'User signed up successfully!';
        } else {
            message.textContent = `Error: ${result.error}`;
        }
    } catch (error) {
        message.textContent = 'An error occurred while signing up the user.';
    }

    form.reset();
});
