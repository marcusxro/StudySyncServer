import express from 'express';
const router = express.Router();
import Analytics from '../collections/Analytics.js';


router.get('/:Uid', async (req, res) => {
    const { Uid } = req.params;

    try {
        const analytics = await Analytics.find({ Uid });

        if (!analytics) {
            return res.status(404).json({ message: 'No analytics found for this Uid' });
        }

        res.status(200).json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;