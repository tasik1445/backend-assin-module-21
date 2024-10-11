const express = require('express');
const fileController = require('../controllers/fileController');

const router = express.Router();

router.post('/upload', fileController.uploadFile);
router.get('/download/:fileId', fileController.getFile);
router.delete('/delete/:fileId', fileController.deleteFile);

module.exports = router;