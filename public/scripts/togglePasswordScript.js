const togglePasswordButton = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePasswordButton.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordButton.textContent = '👁️';
        togglePasswordButton.style.textDecoration = 'line-through';
    } else {
        passwordInput.type = 'password';
        togglePasswordButton.textContent = '👁️';
        togglePasswordButton.style.textDecoration = 'none';
    }
});
