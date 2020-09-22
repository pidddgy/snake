const { randomBytes } = require('crypto');
const express = require('express');
const { stat } = require('fs');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Snake = require('./snake.js');

const n = 80;

// State -> object of the board
let state = {
    snakes: {},
    apples: []
};


rnd = (mi, ma) => {
    return Math.floor(Math.random() * (ma - mi) ) + mi;
}

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected with id ' + socket.id);
    state.snakes[socket.id] = new Snake();

    socket.on('direction change', (dir) => {
        console.log('user ' + socket.id + 'wants to change direction to:')
        console.log(dir);
        state.snakes[socket.id].dir = dir;
    });

    socket.on('disconnect', () => {
        delete state.snakes[socket.id];
        console.log('user ' + socket.id + ' disconnected');
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

setInterval(() => {
    Object.keys(state.snakes).forEach(function (i) {
        state.snakes[i].update();
        let hitapple = false;
        let head = state.snakes[i].body[0];

        for(let i = 0; i < state.apples.length; i++) {
            let a = state.apples[i];

            if(a[0] === head[0] && a[1] === head[1]) {
                hitapple = true;
            }
        }

        if(hitapple) {
            state.snakes[i].grow();
        }
    });
    io.emit("state", state);

    

    if(state.apples.length < 5) {
        let emp = [rnd(0, n-1), rnd(0, n-1)];
        state.apples.push(emp);
        console.log("pushing: ");
        console.log(emp);
    }
}, 100);
