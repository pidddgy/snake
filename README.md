# Snake Clone

**Play the game at https://vast-gorge-79620.herokuapp.com/**

This is the multiplayer snake game! Inspired by the retro classic and slither.io. The object is get as big as possible while simultaneously stopping others from growing (kill them by running in front of them). Some features include a live scoreboard and customizable nickname/color. Check it out @ https://vast-gorge-79620.herokuapp.com/ . Control the snakes with arrow keys.

## High level overview
### Snake class
- Each snake has their own class with a body, direction, color, nickname, `growing` variable and `queue`.
- When a snake eats an apple `growing` is incremented
- Each snake has an `update` function that shifts all the squares in the current direction. If `growing` is positive then we decrement it and keep the lastmost square.
- Obviously we don't want to let the user make a 180 degree turn, so we have to use a queue that stores the user's direction changes. It's not sufficient to directly modify the direction (and check if we are moving in the opposite direction before changing) because the user could change a direction twice really fast before `update` is called again.

### Server-side operations

- The state of the game is represented as an object with a list of id:snake pairs and apples
- Continuously update each snake, eating apples if a snake's head is on top of one
- After updating, we check how many snakes occupy each square and if a square is occupied by more than 2 snakes we kill all snakes occupying that square
- We continuously push apples if the number of apples is below a random threshold
- After we update everything, send the new state of the game to all the clients (repeat every 70 ms)

### Front-end rendering

- None of the calculations are actually done on the client side: there's catchphrases about a "single source of truth", but really I just want to prevent desync.
- Known limitation: the board may not fit into smaller window sizes or resolutions, but this can be overcome by zooming out.

### Stuff used
- Frontend: [p5.js](https://p5js.org), [Semantic UI](https://semantic-ui.com/)
- Backend: [node.js](https://nodejs.org/en/), [express.js](https://expressjs.com/)
- Misc: [socket.io](socket.io), [Heroku](https://www.heroku.com/), some random sound effects I found on YouTube

![alt text](https://i.imgur.com/2KLubDB.png)

### Local installation instructions

```
git clone https://github.com/pidddgy/snake
npm install
node index.js
```
