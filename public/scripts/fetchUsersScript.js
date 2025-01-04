async function fetchUsers() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    try {
        const response = await fetch('/api/users');
        const users = await response.json();

        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `Name: ${user.name} || Email Address: ${user.email} || Password: ${user.password}`;
            userList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Fetch users when the page loads
window.onload = fetchUsers;
