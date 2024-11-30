const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/CloudinaryConfig');
const accounts = require('../collections/Accounts');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });


router.post('/', upload.single('profilePicture'), async (req, res) => {
    const { Email, Username, Password, Uid, education_level } = req.body;

    // Validate required fields
    if (!Email || !Username || !Password || !Uid) {
        return res.status(400).json({ message: 'Email, Username, Password, and Uid are required' });
    }

    try {
        // Check if user already exists
        const isFound = await accounts.findOne({ Uid });

        // If the user is found, update the account
        if (isFound) {
            // Update the user info (excluding profile picture initially)
            await accounts.updateOne({ Uid }, {
                $set: {
                    Email,
                    Username,
                    Password,
                    education_level,
                    isDone: true,
                }
            });

            console.log('Account updated successfully');

            // If a new profile picture is uploaded, update it
            if (req.file) {
                const uploadResult = await cloudinary.default.uploader.upload(req.file.path, {
                    folder: 'profile_pictures',
                    public_id: Uid,
                });

                // Update the profile picture URL in the database
                await accounts.updateOne({ Uid }, {
                    $set: {
                        profilePictureUrl: uploadResult.secure_url
                    }
                });
                console.log('Profile picture updated successfully');
            }

            // Return success response
            req.io.emit('newAccount', { message: 'New account created', account });
            return res.status(200).json({ message: 'Account updated successfully', account: isFound });

        } else {
            // If the user is not found, create a new account
            const account = new accounts({
                Email,
                Username,
                Password,
                Uid,
                isBanned: false,
                isDone: true,
                interests: [],
                education_level,
                friends: [],
            });

            // If a profile picture is uploaded, handle it
            if (req.file) {
                const uploadResult = await cloudinary.default.uploader.upload(req.file.path, {
                    folder: 'profile_pictures',
                    public_id: Uid,
                });
                account.profilePictureUrl = uploadResult.secure_url;
            }

            // Save the new account
            await account.save();

            console.log('New account created successfully');

            // Emit event using `req.io`
            req.io.emit('newAccount', { message: 'New account created', account });

            // Return success response
            req.io.emit('newAccount', { message: 'New account created', account });
            return res.status(200).json({ message: 'Account created successfully', account });
        }

    } catch (error) {
        console.error('Error processing account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
