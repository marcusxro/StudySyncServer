import express from 'express';
const router = express.Router();
import Schedule from '../collections/Schedule.js';


router.post('/', async (req, res) => {
    const { Uid } = req.body

    console.log(req.body);
    try {
        if(Uid === undefined) {
            return res.status(400).json({ message: 'Missing Uid' });
        }

        if(Uid === '') {
            return res.status(400).json({ message: 'Empty Uid' });
        }

        
        const scheduleData = await Schedule.find({ SelectedUser: Uid, isAgreed: false });

        res.status(201).json(scheduleData);

    }

    catch (error) {
        console.error('Error fetching schedule:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;