

const express = require('express');
const router = express.Router();
const accounts = require('../collections/Accounts'); // Make sure to require your accounts model


router.post('/', async (req, res) => {
    const { Uid } = req.body; // Extract Uid from request body

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const account = await accounts.findOne({ Uid });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        res.status(200).json(account); // Send the account data as a response
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;