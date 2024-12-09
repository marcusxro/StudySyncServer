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
    origin: '*',
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
import ReportRouter from './routes/ReportUser.js';
import AcvitiyPost from './routes/PostActivity.js';
import ActivityGet from './routes/GetActivities.js';
import PostSchedule from './routes/PostSchedule.js';
import GetSchedule from './routes/GetSched.js';
import SelectedUserSched from './routes/GetSchedByInvite.js';
import AcceptSchedRouter from './routes/AcceptSched.js';
import UpdateProfilePic from './routes/UpdateProfilePic.js';
import ChangeUsernameRouter from './routes/ChangeUsername.js';
import BanUserRouter from './routes/BanUser.js';
import RecoverUserRouter from './routes/RecoverUser.js';
import GetContacts from './routes/GetContact.js';
import GetReports from './routes/GetReport.js';
import PostAnalytics from './routes/PostAnalytics.js';
import GetAnalytics from './routes/GetAnalytics.js';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware
app.use(
  cors({
    origin: '*',
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
  res.send('Hello World!');
});

app.use('/updateAccount', UpdateAccount);
app.use('/createAndUploadUser', accountsRouter);
app.use('/getHobbies', Hobbies);
app.use('/user', GetPfp);
app.use('/contact', ContactMsgRoute);
app.use('/reportUser', ReportRouter);
app.use('/postActivity', AcvitiyPost);
app.use('/getActivity', ActivityGet);
app.use('/postSchedule', PostSchedule);
app.use('/getSchedule', GetSchedule);
app.use('/getScheduleByInvite', SelectedUserSched);
app.use('/acceptSchedule', AcceptSchedRouter);
app.use('/updateProfilePic', UpdateProfilePic);
app.use('/changeUsername', ChangeUsernameRouter);
app.use('/banUser', BanUserRouter);
app.use('/recoverUser', RecoverUserRouter);
app.use('/getContacts', GetContacts);
app.use('/getReports', GetReports);
app.use('/postAnalytics', PostAnalytics);
app.use('/getAnalytics', GetAnalytics);

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

io.on('connection', (socket) => {
  console.log("==========================================================");
  console.log('A user connected:', socket.id);

  // User joins a room based on their interest
  socket.on("join_interest", ({ interest, userInfo }) => {
    let roomID;

    // If the interest doesn't exist in the roomsByInterest, create it
    if (!roomsByInterest[interest]) {
      roomsByInterest[interest] = [];
    }

    // Find an existing room with space (less than 2 users)
    const existingRoom = roomsByInterest[interest].find(
      (room) => io.sockets.adapter.rooms.get(room)?.size < 2
    );

    // If a room exists, join it, otherwise create a new room
    if (existingRoom) {
      roomID = existingRoom;
    } else {
      roomID = `${interest}_${Date.now()}`;
      roomsByInterest[interest].push(roomID);
    }

    // Add the user to the room
    socket.join(roomID);

    // Track user info in the room
    if (!usersInRooms[roomID]) {
      usersInRooms[roomID] = [];
    }

    // Add the new user to the room's user list
    usersInRooms[roomID].push({ ...userInfo });

    // Notify all users in the room about the updated user list
    io.to(roomID).emit('room_updated', {
      roomID,
      users: usersInRooms[roomID],
    });

    console.log(`User ${socket.id} joined room: ${roomID}`);

    // Emit to the user who joined about the current room state
    socket.emit('room_joined', {
      roomID,
      users: usersInRooms[roomID],
    });
  });

  // Handle friend request


  socket.on('add_friend', ({ roomID, targetUserId, myUserId }) => {
    console.log(`User ${myUserId} wants to add ${targetUserId} as a friend in room ${roomID}`);

    console.log("==========================================================");
    console.log(usersInRooms[roomID]?.find(user => user.userId === myUserId)?.displayName || 'Unknown')
    // Emit the friend request to the target user
    io.to(roomID).emit('friend_request', {
      requesterId: myUserId,
      targetId: targetUserId,
      requesterName: usersInRooms[roomID]?.find(user => user.userId === myUserId)?.displayName || 'Unknown',
    });
  });



  // Handle friend request response
  socket.on('respond_friend_request', async ({ requesterId, targetId, response }) => {
    if (response === undefined) {
      console.log('No response provided for friend request.');
      return; // Ensure no default decline happens
    }
    if (!['accept', 'decline'].includes(response)) {
      console.log('Invalid response received.');
      return;
  }

    try {
      // If accepted, add each user to the other's friends array
      if (response === 'accept') {
        console.log(`User ${targetId} accepted friend request from ${requesterId}`);
        const accepter = await accounts.findOne({ Uid: targetId });  // Target user accepting the request
        const requester = await accounts.findOne({ Uid: requesterId });  // Requester sending the friend request
        if (!accepter || !requester) {
          console.error('One or both users not found for friend addition.');
          return;
        }
        // Add requesterId to the target user's friends array
        if (!accepter.friends.includes(requesterId)) {
          accepter.friends.push(requesterId);
          socket.to(requesterId).emit('friend_request_accepted', { friendId: targetId });
          
        }
        // Add targetId to the requester's friends array
        if (!requester.friends.includes(targetId)) {
          requester.friends.push(targetId);
          io.to(requesterId).emit('friend_request_accepted', { friendId: targetId });
        }
        // Save both users' updated friends list
        await accepter.save();
        await requester.save();
       fetch('https://studysyncserver.onrender.com/postActivity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Uid: requesterId,
            Message: `You and ${accepter.Username} are now friends!`,
            Date: Date.now(),
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
            console.log('Activity posted:', data)
          })
          .catch((error) => console.error('Error posting activity:', error));
           
          fetch('https://studysyncserver.onrender.com/postActivity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Uid: targetId,
              Message: `You and ${requester.Username} are now friends!`,
              Date: Date.now(),
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
              console.log('Activity posted:', data)
            })
            .catch((error) => console.error('Error posting activity:', error));
        // Emit the events to notify both users
        socket.to(targetId).emit('friend_added', { friendId: requesterId });

        console.log(`Friendship established between ${requesterId} and ${targetId}`);
      } else {
        // Decline the request if not accepted
        socket.to(requesterId).emit('friend_request_declined', { targetId: targetId });

        console.log(`User ${targetId} declined friend request from ${requesterId}`);
      }
    } catch (error) {
      console.error('Error responding to friend request:', error);
    }
  });



  socket.on('user_left_room', ({ roomID, userId }) => {
    console.log(`User ${userId} is leaving room ${roomID}`);

    // Remove the user from the specific room
    if (usersInRooms[roomID]) {
      usersInRooms[roomID] = usersInRooms[roomID].filter(user => user.userId !== userId);

      // Log the updated user list
      console.log(`Updated users in room ${roomID}:`, usersInRooms[roomID]);

      if (usersInRooms[roomID].length === 0) {
        // If the room is empty, delete it from the rooms data
        delete usersInRooms[roomID];
        console.log(`Room ${roomID} is now empty and deleted.`);
      } else {
        // Emit the updated list of users to the remaining users in the room
        io.to(roomID).emit('room_updated', {
          roomID,
          users: usersInRooms[roomID],
        });
        console.log("==========================================================");
        console.log(`User ${userId} left room: ${roomID}`);
        console.log("==========================================================");
      }
    }
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log("==========================================================");
    console.log('A user disconnected:', socket.id);

    // Remove the user from all rooms they were in
    for (const [roomID, userList] of Object.entries(usersInRooms)) {
      usersInRooms[roomID] = userList.filter(user => user.userId !== socket.id);

      // Log the updated user list
      console.log(`Updated users in room ${roomID}:`, usersInRooms[roomID]);

      if (usersInRooms[roomID].length === 0) {
        delete usersInRooms[roomID];
        console.log(`Room ${roomID} is now empty and deleted.`);
      } else {
        io.to(roomID).emit('room_updated', {
          roomID,
          users: usersInRooms[roomID],
        });
        console.log("==========================================================");
        console.log(`User ${socket.id} left room: ${roomID}`);
        console.log("==========================================================");
      }
    }

    // Remove empty rooms
    for (const [interest, rooms] of Object.entries(roomsByInterest)) {
      roomsByInterest[interest] = rooms.filter(room => io.sockets.adapter.rooms.get(room));
      if (roomsByInterest[interest].length === 0) {
        delete roomsByInterest[interest];
        console.log(`No rooms left for interest ${interest}, deleting interest.`);
      }
    }
  });
});




const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
