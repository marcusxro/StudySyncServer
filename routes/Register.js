

const express = require('express');
const router = express.Router();
const accounts = require('../collections/Accounts'); // Make sure to require your accounts model






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

module.exports = router;