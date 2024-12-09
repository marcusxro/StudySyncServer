import express from 'express';
const router = express.Router();
const app = express();
import accounts from '../collections/Accounts.js';
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer(app); // Attach Express app to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});



router.post('/', async (req, res) => {
    const { Uid } = req.body;

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    try {
        const account = await accounts.findOne({ Uid });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        account.isBanned = false;
        await account.save();

        // Emit the recover event
        io.emit('updateAccount', { Uid: account.Uid, isBanned: false });

        res.status(200).json(account);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;