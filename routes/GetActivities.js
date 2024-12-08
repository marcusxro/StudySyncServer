import express from 'express';
const router = express.Router();
import Activity from '../collections/Activity.js';


router.post('/', async (req, res) => {
    const { Uid } = req.body; // Extract Uid from request body

    console.log(req.body);

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const userActivity = await Activity.find({ Uid: Uid });
    
        if (!userActivity) {
            return res.status(400).json({ message: 'User has no activity' });
        }
    
        res.status(201).json({ userActivity, message: 'User activity fetched successfully' });
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;