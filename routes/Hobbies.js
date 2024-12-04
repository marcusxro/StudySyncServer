
import hobbies from '../utils/Interests.js';


import express from 'express';
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        res.status(200).json(hobbies); 
    } catch (error) {
        console.error('Error fetching hobbies:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;



