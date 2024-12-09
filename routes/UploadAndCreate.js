import express from 'express';
const router = express.Router();
import multer from 'multer';
import cloudinary from '../utils/CloudinaryConfig.js';
import accounts from '../collections/Accounts.js';


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
        const isFound = await accounts.findOne({ Uid: Uid });
        console.log('Account found:', isFound);
        // If the user is found, update the account
        if (isFound) {
            console.log('Account found:', isFound);
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
            console.log(req.file)
            // If a new profile picture is uploaded, update it
            if (req.file) {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'profile_pictures',
                    public_id: Uid,
                });
                console.log('ppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp')
                console.log('Profile picture updated successfully');
                console.log(uploadResult)

                console.log(uploadResult)
                if(uploadResult) {
                    
                    return res.status(200).json({
                        message: 'Profile picture updated successfully',
                        url: uploadResult.secure_url,
                    });
                } else {
                    return res.status(500).json({ message: 'Cloudinary upload failed' });
                }
            }


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
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'profile_pictures',
                    public_id: Uid,
                });
                account.profilePictureUrl = uploadResult.secure_url;
            }

            // Save the new account
            await account.save();

            console.log('New account created successfully');



            // Return success response
            req.io.emit('newAccount', { message: 'New account created', account });
            return res.status(200).json({ message: 'Account created successfully', account });
        }

    } catch (error) {
        console.error('Error processing account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;

