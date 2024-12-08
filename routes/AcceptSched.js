import express from 'express';
const router = express.Router();
import Schedule from '../collections/Schedule.js';

router.put('/', async (req, res) => {
    const { ScheduleId } = req.body;

    console.log(req.body);
    try {
        const scheduleData = await Schedule.findOne({ _id: ScheduleId });

        if (!scheduleData) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        scheduleData.isAgreed = true;

        await scheduleData.save();

        res.status(200).json({ message: 'Schedule updated successfully', scheduleData });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;