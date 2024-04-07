const app = require('./app');
const db = require('./config/db');
const { Server } = require('socket.io');

db();

const port = process.env.PORT || 4000;
const server = require('http').createServer(app);

server.listen(port, () => {
    console.log(`server is running on ${port}`);
});

module.exports = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});
