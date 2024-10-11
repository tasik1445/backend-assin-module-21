const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', studentController.registerStudent);
router.post('/login', studentController.loginStudent);
router.get('/profile', authMiddleware, studentController.getStudentProfile);
router.put('/profile', authMiddleware, studentController.updateStudentProfile);

module.exports = router;