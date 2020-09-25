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

reset = (id) => {
    let sx = rnd(0, n-1), sy = rnd(0, n-1);

    state.snakes[id].body = [[sx, sy]];

    state.snakes[id].dir = [0, 0];
    state.snakes[id].dir[rnd(0, 1)^1] = 1;

    if(rnd(0, 1) == 1) {
        for(let i = 0; i <= 1; i++) {
            state.snakes[id].dir[i] *= -1;
        }
    }
} 

rnd = (mi, ma) => {
    return Math.floor(Math.random() * (ma - mi + 1)) + mi;
}

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected with id ' + socket.id);
    state.snakes[socket.id] = new Snake();
    reset(socket.id);

    socket.on('direction change', (dir) => {
        console.log('user ' + socket.id + 'wants to change direction to:')
        console.log(dir);

        let op = state.snakes[socket.id].dir.slice();
        let same = true;
        for(let i = 0; i <= 1; i++) {
            op[i] *= -1;

            if(Math.abs(dir[i]-op[i]) > 0.001) same = false;
        }
        
        if(!same) {
            state.snakes[socket.id].dir = dir;
        }
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
        
        del = [];
        for(let i = 0; i < state.apples.length; i++) {
            let a = state.apples[i];

            if(a[0] === head[0] && a[1] === head[1]) {
                hitapple = true;
                del.push(i);
            }
        }

        if(hitapple) {
            state.snakes[i].grow();
            state.snakes[i].grow();
            state.snakes[i].update();
        }

        newapples = [];

        for(let i = 0; i < state.apples.length; i++) {
            if(!del.includes(i)) {
                newapples.push(state.apples[i]);
            }
        }

        state.apples = newapples;
    });

    cnt = [];
    for(let i = 0; i < 80; i++) {
        row = [];
        for(let j = 0; j < 80; j++) {
            row.push(0);
        }
        cnt.push(row);
    }

    Object.keys(state.snakes).forEach(function (i) {
        for(let j = 0; j < state.snakes[i].body.length; j++) {
            let x = state.snakes[i].body[j];
            cnt[x[0]][x[1]]++;
        }
    });

    Object.keys(state.snakes).forEach(function (i) {
        let head = state.snakes[i].body[0];
        if(cnt[head[0]][head[1]] > 1) {
            reset(i);
        }
    });

    io.emit("state", state);

    if(state.apples.length < 25) {
        let emp = [rnd(0, n-1), rnd(0, n-1)];
        state.apples.push(emp);
        console.log("pushing: ");
        console.log(emp);
    }
}, 100);
