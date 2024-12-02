
const express = require('express');
const router = express.Router();
const Contact = require('../collections/ContactMsg'); // Make sure to require your accounts model



router.post('/', async (req, res) => {

    const { Firstname, Lastname, Email, Interests, Message } = req.body;

    const newContact = new Contact({
        Firstname,
        Lastname,
        Email,
        Interests,
        Message
    });

    console.log(newContact)
    newContact.save()
        .then(() => {
            res.status(200);
            res.send("Contact Message Sent Successfully");
        })
        .catch((e) => {
            res.status(400);
            res.send("Error Sending Message: " + e);
        });



});

module.exports = router;