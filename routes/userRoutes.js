const express = require('express');
const { createUser, getUsers, loginUser } = require('../controllers/userController');

const router = express.Router();

// Route to create a new user (POST /api/users)
router.post('/users', createUser);

// Route to get all users (GET /api/users)
router.get('/users', getUsers);

// Route to login a user (POST /api/users/login)
router.post('/users/login', loginUser);

module.exports = router;
