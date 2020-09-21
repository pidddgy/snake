var socket = io();
console.log("hello");

socket.on('state', (state) => {
    console.log("state received");
    console.log(state);
})

setup = () => {
    createCanvas(690, 690);
}

draw = () => {
    background(220);
}