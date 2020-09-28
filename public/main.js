
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
    let cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    document.getElementById("scolor").value = "#ffffff";
    updateConfig();
}

draw = () => {
    background(220);
    updateConfig();
    Object.keys(state.snakes).forEach(function (i) {
        console.log(state.snakes[i]);
        let body = state.snakes[i].body;
        for(let j = 0; j < body.length; j++) {
            console.log("drawing w color " +state.snakes[i].color);
            console.log(state.snakes[i].color);
            fill(color(state.snakes[i].color));
            // console.log("draw at " + body[j][0] + " " + body[j][1]);
            square(body[j][0]*10, body[j][1]*10, 10);
            fill(color(255, 255, 255));
        }
        let head = body[0];
        textSize(12);
        fill(50);
        
        let shift = 10;
        const left = [-1, 0];
        const up = [0, -1];
        for(let i = 0; i <= 1; i++) {
            if(Math.abs(state.snakes[i]-left[i]) > 0.001) shift = 0;
        }
            
        let xshift = -20;
        for(let i = 0; i <= 1; i++) {
            if(Math.abs(state.snakes[i]-up[i]) > 0.001) xshift = 0;
        }

        if(xshift === -20) shift = -10;
        text(state.snakes[i].nick, head[0]*10+(state.snakes[i].dir[0]*10)+xshift, head[1]*10+(state.snakes[i].dir[1]*10)+shift, 100, 100);
    });

    state.apples.forEach((apple) => {
        fill(color(255, 0, 0));
        // console.log("draw at " + apple[0] + " " + apple[1]);
        square(apple[0]*10, apple[1]*10, 10)
        fill(color(255, 255, 255));

    })
}

keyPressed = () => {
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

updateConfig = () => {
    let nick = document.getElementById("nick").value;
    let color = document.getElementById("scolor").value;

    // console.log("config change, state is " + nick + "," + color);

    socket.emit('config change', [nick, color])
}