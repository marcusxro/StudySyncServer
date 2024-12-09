import express from 'express';
const router = express.Router();


import Contact from '../collections/ContactMsg.js' // Make sure to require your accounts model


router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching Contacts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;