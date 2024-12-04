
import express from 'express';
const router = express.Router();
import accounts from '../collections/Accounts.js'; // Import your accounts model




router.post('/', (req, res) => {
    const { Email, Username, Password, Uid } = req.body;
    const newAccount = new accounts({
        Email,
        Username,
        Password,
        Uid,
        isBanned: false,
        isDone: false,
        interests: [],
        education_level: "",
        friends: []

    });

    console.log(newAccount)
    newAccount.save()
        .then(() => {
            res.status(200);
            res.send("Account Created Successfully");
        })
        .catch((e) => {
            res.status(400);
            res.send("Error Creating Account: " + e);
        });
});

export default router;
