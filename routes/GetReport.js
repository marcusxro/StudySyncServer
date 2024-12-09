import express from 'express';
const router = express.Router();
import Report from '../collections/Reports.js';


router.get('/', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving reports', error });
    }
})

export default router;