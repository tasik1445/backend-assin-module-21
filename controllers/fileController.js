const File = require('../models/file');
const multer = require('multer');

const upload = multer({
    storage: multer.diskStorage({
        destination: 'uploads/student_profiles',
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })
});

// File upload
const uploadFile = (req, res) => {
    try {
        const file = new File({
            name: req.file.originalname,
            path: req.file.path
        });
        file.save();
        res.status(201).json({ message: 'File uploaded successfully', file });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// File read
const getFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        res.sendFile(file.path);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// File delete
const deleteFile = async (req, res) => {
    try {
        await File.findByIdAndDelete(req.params.fileId);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    uploadFile,
    getFile,
    deleteFile
};