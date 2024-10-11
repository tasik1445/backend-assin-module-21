const Student = require('../models/student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config/jwtConfig');

// Student registration
const registerStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new student
        const newStudent = new Student({ name, email, password: hashedPassword });
        await newStudent.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newStudent._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        res.cookie('jwt', token, { httpOnly: true });

        res.status(201).json({ message: 'Student registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Student login
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, student.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: student._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set cookie
        res.cookie('jwt', token, { httpOnly: true });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Student profile read
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user._id);
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Student profile update
const updateStudentProfile = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    getStudentProfile,
    updateStudentProfile
};