import express from 'express';
const router = express.Router();
import accounts from '../collections/Accounts.js';


router.post('/', async (req, res) => {
    const { Uid, education_level} = req.body; // Extract Uid from request body

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const account = await accounts.findOne({ Uid });

 

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        console.log('Account found:', account);

        account.Username = req.body.Username;
        account.education_level = req.body.education_level;
        
        await account.save(); // Save the updated account

        res.status(200).json(account); // Send the account data as a response
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;