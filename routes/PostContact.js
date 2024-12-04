

import Contact from '../collections/ContactMsg.js' // Make sure to require your accounts model

import express from 'express';
const router = express.Router();


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

export default router;
