class Snake {
    // body -> list of pairs
    constructor() {
        this.body = [[0, 3], [0, 4], [0, 5], [0, 6]];
        this.dir = [0, 1]; // todo -> change
    }

    update() {
        let cur = this.body[0];
        let newpos = [cur[0]+this.dir[0], cur[1]+this.dir[1]];

        this.body.unshift(newpos);
        this.body.pop();
    }

    grow() {
        console.log("growing");
        this.body.push(this.body[this.body.length-1]);
    }
}

module.exports = Snake;