import { Server } from 'socket.io';
const io = new Server(2020);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        console
        io.emit('chat message', msg);
    })
})


export default io;