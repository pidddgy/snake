const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Snake = require('./snake.js');

// State -> list of snake objects
let state = [[1, 'hugs']];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected with id ' + socket.id);
    socket.on('disconnect', () => {
        console.log('user ' + socket.id + ' disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

let test = 0;
setInterval(() => {
    io.emit("state", state);
    state[0][0] = test;
    test++;
}, 1000);
