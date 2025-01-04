const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password });
        res.status(201).json(user); // If successful, send a 201 (successfully created) response with the user
    } catch (error) {
        res.status(400).json({ error: error.message }); // If failure, Send a 400 (slient invalid request) response with the error message
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll(); // Attempt to fetch users from the database
        res.status(200).json(users); // If successful, send a 200 (success) response with the users
    } catch (error) {
        res.status(500).json({ error: error.message }); // If failure, Send a 500 (server error) response with the error message
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } }); // Attempt to find a user with the provided email
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // If user not found, send a 404 (not found) response
        }

        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' }); // If password is incorrect, send a 401 (unauthorized) response
        }

        res.status(200).json({user}); // If successful, send a 200 (success) response with the user
    } catch (error) {
        res.status(500).json({ error: error.message }); // If failure, Send a 500 (server error) response with the error message
    }
}
