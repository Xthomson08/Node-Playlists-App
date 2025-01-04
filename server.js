require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./db');
const User = require('./models/User');

const app = express();
app.use(express.json()); // Middleware to parse JSON

// Serve static files from the "public" directory
app.use(express.static('public'));

// Redirect root to serve index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/sign-up', (req, res) => {
  res.sendFile(__dirname + '/public/sign-up.html');
});
app.get('/logged-inView', (req, res) => {
  res.sendFile(__dirname + '/public/logged-inView.html');
});

// Test database connection and sync models
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL');
        await sequelize.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Unable to connect to PostgreSQL:', error.message);
        process.exit(1);
    }
})();

// API routes
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
