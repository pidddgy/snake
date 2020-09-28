
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

    let v = [];
    Object.keys(state.snakes).forEach((i) => {
        v.push(state.snakes[i]);        
    })

    // should snake l be ordered before r?
    compare = (l, r) => {
        return r.body.length - l.body.length;
    }
    v.sort(compare);

    // console.log(v);

    html = '';
    for(let i = 0; i < v.length; i++) {
        let snake = v[i];
        // console.log(snake);
        html += "<div class=\"item\"> ";
            html += "<div class=\"content\"> ";
                let nick = snake.nick;
                if(nick.length === 0) nick = "(unnamed snake)";
                html += "<div class=\"header\"> "+ nick +" </div> ";
            html += snake.body.length;
            html += ' points';
            html += '</div>';
        html += '</div>';
    }

    document.getElementById("rankings").innerHTML = html;
})

let slap, bite;
socket.on('playSound', (sound) => {
    console.log("play sound" + sound);

    if(sound === 'slap') {
        slap.play();
    } else if(sound == 'bite') {
        bite.play();
    }
})

preload = () => {
    slap = loadSound('slap.mp3');
    bite = loadSound('bite.wav');
}

setup = () => {
    let cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    document.getElementById("scolor").value = "#ffffff";
    updateConfig();
    soundFormats('mp3', 'wav');
}

// compare integer arrays with epilson
cmp = (a, b) => {
    let same = true;
    for(let i = 0; i < a.length; i++) {
        if(abs(a[i]-b[i]) > 0.0001) {
            same = false;
        }
    }

    return same;
}

draw = () => {
    background(220);
    updateConfig();
    Object.keys(state.snakes).forEach(function (i) {
        // console.log(state.snakes[i]);
        let body = state.snakes[i].body;
        for(let j = 0; j < body.length; j++) {
            // console.log("drawing w color " +state.snakes[i].color);
            // console.log(state.snakes[i].color);
            fill(color(state.snakes[i].color));
            // console.log("draw at " + body[j][0] + " " + body[j][1]);
            square(body[j][0]*10, body[j][1]*10, 10);
            fill(color(255, 255, 255));
        }
        let head = body[0];
        textSize(12);
        fill(50);
        
        let shift = 10;
        
        let d = state.snakes[i].dir;

        shift = null;
        if(cmp(d, [-1, 0])) {
            shift = [0, 0];
        } else if(cmp(d, [1, 0])) {
            shift = [0, 2];
        } else if(cmp(d, [0, 1])) {
            shift = [0, 2];
        } else {
            shift = [0, 0];
        }
        text(state.snakes[i].nick, 10*(head[0]+shift[0]), 10*(head[1]+shift[1]));
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