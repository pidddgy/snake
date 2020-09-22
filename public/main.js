var socket = io();
console.log("hello");

let state = {
    snakes: {},
    apples: []
};

socket.on('state', (newState) => {
    // console.log("state received");
    state = newState;
    // console.log(state.apples);
})

setup = () => {
    createCanvas(800, 800);
}

draw = () => {
    background(220);
    Object.keys(state.snakes).forEach(function (i) {
        let body = state.snakes[i].body;
        for(let j = 0; j < body.length; j++) {
            console.log("draw at " + body[j][0] + " " + body[j][1]);
            square(body[j][0]*10, body[j][1]*10, 10);
        }
    });

    state.apples.forEach((apple) => {
        fill(color(255, 0, 0));
        console.log("draw at " + apple[0] + " " + apple[1]);
        square(apple[0]*10, apple[1]*10, 10)
        fill(color(255, 255, 255));

    })
}

keyPressed = () => {
    console.log(socket.emit);

    if(keyCode === LEFT_ARROW) {
        socket.emit('direction change', [-1, 0]);
    } else if(keyCode === RIGHT_ARROW) {
        socket.emit('direction change', [1, 0]);
    } else if(keyCode === DOWN_ARROW) {
        socket.emit('direction change', [0, 1]);
    } else if(keyCode === UP_ARROW) {
        socket.emit('direction change', [0, -1]);
    }
}
