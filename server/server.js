const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const PORT = 4000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
    }
});

// ------------
let signedInUsers = [];

const chatRooms = []

io.on('connection', (socket) => {


    socket.on('user-connected', () => {
        
    }); 

    // 'CREATE ROOM'
    socket.on('create-room', (roomTitle, _password) => {
        chatRooms.push({
            roomTitle: roomTitle,
            password: _password,
        });

        io.emit('all-rooms', chatRooms);
        console.log('skapat rum: ', roomTitle, _password);
        console.log('Alla rum', chatRooms);
    });
    
    // MESSAGE
    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', data);
        
        console.log('consolelog servern:' + data)
    }); 
    
    /* JOIN ROOM */
    socket.on('join-room', (data) => {
        socket.join(data);
        io.emit('all-rooms', getAllRooms());
        console.log('user has joined room ' + data);
    });

    /* LEAVE ROOM */

    socket.on('leave-room', () => {
        findUser = signedInUsers.find((user) => user = socket.id);
        
        console.log(findUser, 'has left room');
        console.log(signedInUsers)
    });

    /* DISCONNECT */
    socket.on('disconnect', (data) => {
        console.log(data)
        // todo: 
        io.emit('all-rooms', chatRooms);
    });

});
// ------------

function getAllRooms() {
    const { rooms } = io.sockets.adapter;
    const keys = Object.keys(rooms);
    console.log(keys)
}


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});