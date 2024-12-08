import express from 'express';
const router = express.Router();
import Schedule from '../collections/Schedule.js';


router.post('/', async (req, res) => {
    const { EventName, SelectedUser, Uid, Date, Time, Description } = req.body

    console.log(req.body);
    try {
        const scheduleData = new Schedule({
            EventName,
            SelectedUser,
            Uid,
            Date,
            Time,
            Description,
            isAgreed: false
        });

        await scheduleData.save();
        res.status(201).json(scheduleData);
    }

    catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;