import express from 'express';
const router = express.Router();
import multer from 'multer';
import cloudinary from '../utils/CloudinaryConfig.js';

// Configure Cloudinary storage for multer
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });


router.post('/', upload.single('profilePicture'), async (req, res) => {
    const { Uid } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Upload file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_pictures',
            public_id: Uid,
        });

        if (uploadResult) {
            console.log('Profile picture updated successfully:', uploadResult.secure_url);
            return res.status(200).json({
                message: 'Profile picture updated successfully',
                url: uploadResult.secure_url,
            });
        } else {
            return res.status(500).json({ message: 'Cloudinary upload failed' });
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        return res.status(500).json({ message: 'An error occurred while uploading the file', error: error.message });
    }
});

export default router;
