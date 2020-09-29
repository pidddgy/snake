let socket = io();

let state = {
    snakes: {},
    apples: []
};

socket.on('state', (newState) => {
    state = newState;

    // Render scoreboard
    let v = [];
    Object.keys(state.snakes).forEach((i) => {
        v.push(state.snakes[i]);        
    })

    // Should snake l be ordered before r?
    compare = (l, r) => {
        return r.body.length - l.body.length;
    }
    v.sort(compare);

    html = '';
    for(let i = 0; i < v.length; i++) {
        let snake = v[i];
        html += "<div class=\"item\"> ";
            html += "<div class=\"content\"> ";
                html += "<div class=\"header nickname\"> </div>";
            html += snake.body.length;
            html += ' points';
            html += '</div>';
        html += '</div>';
    }

    document.getElementById("rankings").innerHTML = html;

    // We have to do this because if we just insert the nickname with innerHTML then people can insert arbitrary HTML code which could be malicious
    for(let i = 0; i < document.getElementsByClassName('header nickname').length; i++) {
        let el = document.getElementsByClassName('header nickname')[i];

        el.textContent = v[i].nick;
        if(v[i].nick.length === 0) {
            el.textContent = "(unnamed snake)";
        }
    }
})

// Receive playSound messages from the server
let slap, bite;
socket.on('playSound', (sound) => {
    if(sound === 'slap') {
        slap.play();
    } else if(sound == 'bite') {
        bite.play();
    }
})

// Load sound files
preload = () => {
    slap = loadSound('slap.mp3');
    bite = loadSound('bite.wav');
}

// Initialize everything
setup = () => {
    let cnv = createCanvas(800, 800);
    cnv.parent('sketch-holder');
    document.getElementById("scolor").value = "#ffffff";
    updateConfig();
    soundFormats('mp3', 'wav');
}

// Compare integer arrays with epilson
cmp = (a, b) => {
    let same = true;
    for(let i = 0; i < a.length; i++) {
        if(abs(a[i]-b[i]) > 0.0001) {
            same = false;
        }
    }

    return same;
}

// Main loop
draw = () => {
    background(220);
    updateConfig();
    Object.keys(state.snakes).forEach(function (i) {
        // Draw each square of the snake's body
        let body = state.snakes[i].body;
        for(let j = 0; j < body.length; j++) {
            fill(color(state.snakes[i].color));
            square(body[j][0]*10, body[j][1]*10, 10);
            fill(color(255, 255, 255));
        }

        // Draw the nickname that the user set
        let head = body[0];
        textSize(12);
        fill(50);
        
        let shift = 10;
        
        let d = state.snakes[i].dir;

        // Decide how to shift the nickname based on direction (try to make it visible)
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

    // Render apples
    state.apples.forEach((apple) => {
        fill(color(255, 0, 0));
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

    socket.emit('config change', [nick, color])
}
