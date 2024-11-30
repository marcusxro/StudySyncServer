const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
app.use(cors());
const bodyParser = require('body-parser');


 
//utils
const cloudinary = require('./utils/CloudinaryConfig')
const multer = require('multer');

const { Server } = require('socket.io');
const http = require('http');



// Create an HTTP server

const server = http.createServer(app); // Attach Express app to the HTTP server
const io = new Server(server, {
    cors: {
        origin: 'http://127.0.0.1:5500',
    },
});

// Listen for incoming socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Example event: Respond to 'message' from the client
    socket.on('message', (data) => {
      console.log('Message from client:', data);
      socket.emit('reply', `Server received: ${data}`);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  app.use((req, res, next) => {
    req.io = io;
    next();
});

  







//collections
const accounts = require('./collections/Accounts');



//routers
const accountsRouter = require('./routes/UploadAndCreate');
const accountsSingleRouter = require('./routes/AccountSingle');
const Hobbies = require('./routes/Hobbies')
const UpdateAccount = require('./routes/UpdateAccount')






app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Middleware
app.use(
    cors({
        origin: 'http://127.0.0.1:5500', 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
        allowedHeaders: ['Content-Type', 'Authorization'], 
    })
);



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


app.use('/getAccountByUid', accountsSingleRouter);



app.get('/', (req, res) => {
    res.send('Hello Worlsd!');

});


const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


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

        const uploadStream = cloudinary.default.uploader.upload_stream(
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


app.use('/updateAccount', UpdateAccount);

app.use('/createAndUploadUser', accountsRouter);

app.use('/getHobbies', Hobbies);



server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});





