
import cloudinary from '../utils/CloudinaryConfig.js'
import express from 'express';
const router = express.Router();


// Endpoint to get image by userId
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {

        // Fetch the image details based on userId
        const result = await cloudinary.search
            .expression(`folder:profile_pictures AND public_id:profile_pictures/${userId}`) // Match folder and public ID
            .max_results(1)                      // Limit results to one
            .execute();


        if (result.resources.length === 0) {
            return res.status(404).json({ message: 'No image found for this user' });
        }

        const imageUrl = result.resources[0].url;
        res.json({ userId, imageUrl });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).json({ error: 'An error occurred while fetching the image' });
    }
});


export default router;
