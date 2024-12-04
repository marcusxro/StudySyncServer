import express from 'express';
const app = express();
const port = 8080;
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';


dotenv.config();
app.use(cors());


//utils
import { Server } from 'socket.io';
import http from 'http';


// Create an HTTP server
const server = http.createServer(app); // Attach Express app to the HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
  },
});


app.use(express.static('client'));



app.use((req, res, next) => {
  req.io = io;
  next();
});

//collections
import accounts from './collections/Accounts.js';

// routers
import accountsRouter from './routes/UploadAndCreate.js';
import accountsSingleRouter from './routes/AccountSingle.js';
import Hobbies from './routes/Hobbies.js';
import UpdateAccount from './routes/UpdateAccount.js ';
import Register from './routes/Register.js';
import GetPfp from './routes/GetPfp.js';
import ContactMsgRoute from './routes/PostContact.js';


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



app.use('/register', Register);

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


app.use('/updateAccount', UpdateAccount);

app.use('/createAndUploadUser', accountsRouter);

app.use('/getHobbies', Hobbies);

app.use('/user', GetPfp);

app.use('/contact', ContactMsgRoute);






// const __dirname = path.dirname(new URL(import.meta.url).pathname);
// app.use(express.static(path.join(__dirname, '../client'))); // Serve frontend files

// const usersByInterest = {}; // { '3d printing': [socket1, socket2], ... }

// const rooms = {}

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);


//   socket.on('set-interest', (interest, callback) => {
//     // Ensure the interest group exists
//     if (!usersByInterest[interest]) {
//       usersByInterest[interest] = [];
//     }

//     // Find a room with space
//     const availableRoom = usersByInterest[interest].find(
//       (room) => room.users.length < 2 && !room.isFull
//     );

//     if (availableRoom) {
//       // Add the user to the available room
//       availableRoom.users.push(socket.id);
//       socket.join(availableRoom.roomUID);
//       socket.interest = interest;
//       socket.roomUID = availableRoom.roomUID;

//       console.log(`User ${socket.id} joined room: ${availableRoom.roomUID}`);
//       callback({ success: true, roomUID: availableRoom.roomUID });

//       // Notify other users in the room
//       io.to(availableRoom.roomUID).emit('room-uid', { roomUID: availableRoom.roomUID });

//       // Lock the room if it's now full
//       if (availableRoom.users.length === 2) {
//         availableRoom.isFull = true;
//         console.log(`Room ${availableRoom.roomUID} is now full.`);
//       }
//     } else {
//       // Create a new room for the user
//       const roomUID = `${interest}-${socket.id}-${Date.now()}`;
//       usersByInterest[interest].push({
//         roomUID,
//         users: [socket.id],
//         isFull: false,
//       });

//       socket.join(roomUID);
//       socket.interest = interest;
//       socket.roomUID = roomUID;

//       console.log(`User ${socket.id} created a new room: ${roomUID}`);
//       callback({ success: true, roomUID });
//     }
//   });

//   // Cleanup logic remains the same as before
//   socket.on('disconnect', () => {
//     const { interest, roomUID } = socket;
//     if (interest && roomUID) {
//       const room = usersByInterest[interest]?.find((r) => r.roomUID === roomUID);

//       if (room) {
//         // Remove the user from the room
//         room.users = room.users.filter((id) => id !== socket.id);

//         // If the room is empty, delete it
//         if (room.users.length === 0) {
//           usersByInterest[interest] = usersByInterest[interest].filter(
//             (r) => r.roomUID !== roomUID
//           );
//           console.log(`Room ${roomUID} deleted.`);
//         } else {
//           // Unlock the room if it's no longer full
//           room.isFull = false;
//           console.log(`Room ${roomUID} is no longer full.`);
//         }
//       }
//     }
//     console.log(`User ${socket.id} disconnected.`);
//   });


//   socket.on('send-message', (message) => {
//     const interest = socket.interest;
//     if (interest) {
//       console.log(`Message from ${socket.id} to ${interest}:`, message);

//       // Broadcast message to users in the same interest group
//       socket.to(interest).emit('receive-message', {
//         from: socket.id,
//         message, 
//       });
//     }
//   });
// });
// Rooms mapping
const roomsByInterest = {};
const usersInRooms = {}; // Keeps track of users in each room


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_interest", ({ interest, userInfo }) => {
    let roomID;

    if (!roomsByInterest[interest]) {
      roomsByInterest[interest] = [];
    }

    const existingRoom = roomsByInterest[interest].find(
      (room) => io.sockets.adapter.rooms.get(room)?.size < 2
    );

    if (existingRoom) {
      roomID = existingRoom;
    } else {
      roomID = `${interest}_${Date.now()}`;
      roomsByInterest[interest].push(roomID);
    }

    socket.join(roomID);

    // Track user info in the room
    if (!usersInRooms[roomID]) {
      usersInRooms[roomID] = [];
    }
    usersInRooms[roomID].push({ ...userInfo });

    console.log(userInfo)
    // Notify the client of the room assignment
  

      io.to(roomID).emit("room_joined", {
        roomID,
        users: usersInRooms[roomID],
      });
    
    console.log(`User ${socket.id} joined room: ${roomID}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);

    // Remove user from rooms
    for (const [roomID, userList] of Object.entries(usersInRooms)) {
      usersInRooms[roomID] = userList.filter((user) => user.userId !== socket.id);
      if (usersInRooms[roomID].length === 0) {
        delete usersInRooms[roomID];
      }
    }

    // Remove empty rooms
    for (const [interest, rooms] of Object.entries(roomsByInterest)) {
      roomsByInterest[interest] = rooms.filter((room) => io.sockets.adapter.rooms.get(room));
      if (roomsByInterest[interest].length === 0) {
        delete roomsByInterest[interest];
      }
    }
  });
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
