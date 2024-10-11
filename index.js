// index.js

const express = require('express');
const mongoose = require('mongoose');
const studentRoutes = require('./routes/studentRoutes');
const fileRoutes = require('./routes/fileRoutes');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Environment Variables (optional)
// You can use environment variables for configuration (e.g., PORT, MongoDB URI)
// For simplicity, we're using hardcoded values here.
// If you prefer using environment variables, consider installing and configuring 'dotenv'.

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/studentDB';
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'student_profiles');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Ensure uploads directory exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/files', fileRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start the server
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
});
