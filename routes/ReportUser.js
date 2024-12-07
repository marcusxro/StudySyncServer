import express from 'express';
const router = express.Router();
import Report from '../collections/Reports.js';


router.post('/', async (req, res) => {
    const { Uid, Type, Message, UidToReport } = req.body; // Extract Uid from request body


    console.log(req.body);

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const reportData = new Report({
            Uid,
            Type,
            Message,
            Date: Date.now(),
            UidToReport,
        });

        await reportData.save();
        res.status(201).json(reportData);
    } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;