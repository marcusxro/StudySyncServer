import express from 'express';
const router = express.Router();
import Activtiy from '../collections/Activity.js';


router.post('/', async (req, res) => {
    const { Uid, Message, Date } = req.body

    console.log(req.body);
    try {
        const activityData = new Activtiy({
            Uid,
            Message,
            Date,
        });

        await activityData.save();
        res.status(201).json(activityData);
    }

    catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;