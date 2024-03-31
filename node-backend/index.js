const app = require('./app');
const db = require('./config/db');
const port = process.env.PORT || 4000;

db();

const server = app.listen(port, () => {
    console.log(`server is running on ${port}`);
});

//=======================Socket IO=======================

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

io.on('connection', socket => {});
