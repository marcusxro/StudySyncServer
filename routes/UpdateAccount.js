import express from 'express';
const router = express.Router();
import accounts from '../collections/Accounts.js'; // Import your accounts model


router.put('/', async (req, res) => {
    const { Uid, Email, Username, Password, isBanned, isDone, interests, education_level, friends } = req.body;

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const account = await accounts.findOne({ Uid });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.Email = Email || account.Email;
        account.Username = Username || account.Username;
        account.Password = Password || account.Password;
        account.isBanned = isBanned || account.isBanned;
        account.isDone = isDone || account.isDone;
        account.interests = interests || account.interests;
        account.education_level = education_level || account.education_level;
        account.friends = friends || account.friends;

        await account.save();

        res.status(200).json(account);

        req.io.emit('updatedAccount', { message: 'New account created', account });
        
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
export default router;
