import express from 'express';
const router = express.Router();
import Analytics from '../collections/Analytics.js';



router.post('/', async (req, res) => {
    const { Uid, Activity } = req.body;

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {

        const analytics = new Analytics({
            Uid,
            Activity: Activity,
            Date: new Date().toISOString(),
        });

        await analytics.save();

        res.status(200).json(analytics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


export default router;