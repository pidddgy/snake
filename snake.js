class Snake {
    // body -> list of pairs
    constructor() {
        // Will get reset at start
        this.body = [];
        this.dir = [0, 0];
        this.color = "#ffffff";
        this.nick = "";
        this.growing = 0;
        // queue of direction changes
        this.queue = [];
    }

    // Function called on tick
    update() {
        let cur = this.body[0];
        if(this.queue.length > 0) {
            this.dir = this.queue[0];
            this.queue.shift();
        }
        let newpos = [cur[0]+this.dir[0], cur[1]+this.dir[1]];
        
        for(let i = 0; i <= 1; i++) {
            if(newpos[i] == -1) newpos[i] = 79;
            if(newpos[i] == 80) newpos[i] = 0;
        }

        this.body.unshift(newpos);

        if(this.growing) {
            this.growing--; 
        } else {
            this.body.pop();
        }
    }

    grow() {
        this.growing++;
    }
}

module.exports = Snake;
