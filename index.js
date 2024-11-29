const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 8080;
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const atlasUri = process.env.ATLAS_URI || '';

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});



const multer = require('multer');



mongoose.connect(atlasUri?.toString())
  .then(() => {
    console.log("Connected to MongoDB Atlas (acc)");

  })
  .catch((e) => {
    console.error("Error connecting to MongoDB Atlas:", e);
  });

const mySchema = new mongoose.Schema({
  Email: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  isBanned: {
    type: Boolean,
  },
  Password: {
    type: String,
    required: true,
  },
  Uid: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  interests: {
    type: Array,
  },
  education_level: {
    type: String,
  },
  friends: {
    type: Array,
  },
});


const accounts = mongoose.model('account', mySchema);



app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});



app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
});




app.post('/register', (req, res) => {
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

app.get('/getAllAccounts', (req, res) => {
    accounts.find()
        .then((accounts) => {
            res.status(200).send(accounts);
        })
        .catch((e) => {
            res.status(400).send("Error Getting Accounts: " + e);
        });
});


app.post('/getAccountByUid', async (req, res) => {
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

app.get('/', (req, res) => {
    res.send('Hello Worlsd!');
   
});


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage});


app.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    const { Uid } = req.body;

    if (!Uid) {
        return res.status(400).json({ message: 'Uid is required' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Profile picture is required' });
    }

    try {
        const account = await accounts.findOne({ Uid });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', public_id: `profile_pictures/${Uid}` },
            (error, result) => {
                if (error) {
                    console.error('Error uploading to Cloudinary:', error);
                    return res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
                }
        
                account.profilePicture = result.secure_url;
                account.save()
                    .then(() => res.status(200).json(account))
                    .catch((error) => {
                        console.error('Error saving account:', error);
                        res.status(500).json({ message: 'Error saving account', error: error.message });
                    });
            }
        );
        
        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.put('/updateAccount', async (req, res) => {
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
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.post('/createAndUploadUser', upload.single('profilePicture'), async (req, res) => {
    const { Email, Username, Password, Uid, education_level } = req.body;

    if (!Email || !Username || !Password || !Uid) {
        return res.status(400).json({ message: 'Email, Username, Password, and Uid are required' });
    }
    console.log(req.file);

    try {
        const account = new accounts({
            Email,
            Username,
            Password,
            Uid,
            isBanned: false,
            isDone: true,
            interests: [],
            education_level,
            friends: [],
        });

        if (req.file) {


            const resultss = await cloudinary.uploader.upload(req.file.path, {
                folder: 'profile_pictures',
                public_id: Uid,
            });
            account.save()
            .then(() => res.status(200).json(account))
            .catch((error) => {
                console.error('Error saving account:', error);
                res.status(500).json({ message: 'Error saving account', error: error.message });
            });
            if(resultss){
                console.log("UPLOADED")
            }


    
        } else {
            account.save()
                .then(() => res.status(200).json(account))
                .catch((error) => {
                    console.error('Error saving account:', error);
                    res.status(500).json({ message: 'Error saving account', error: error.message });
                });
        }
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





