const Room = require('../utils/room');
const User = require('../models/userModel');
const Stream = require('../models/streamModel');
const io = require('../index');

let rooms = {},
    users = new Set();

const getUser = socketId => {
    users.forEach(e => {
        if (socketId == e.socketId) return e;
    });
    return null;
};

const getuserInfo = async socketId => {
    const user = await User.findById(getUser(socketId).userId);
    if (!user) console.log('err.....no user');
    return user;
};

io.on('connection', socket => {
    console.log(`user connected: ${socket.id}`);

    try {
        socket.on('add-user', userId => {
            users.add({ userId, socketId: socket.id });
        });

        socket.on('create-live', async roomId => {
            const stream = await Stream.findById(roomId);
            if (!stream)
                socket.emit('error', 'No stream is available with this id');

            const room = Room(roomId, getUser(socket.id), stream.thumbnail);
            rooms.roomId = room;
        });

        socket.on('end-live', async roomId => {
            const room = rooms.roomId;
            const streamData = {
                maxViews: room.maxViews,
                positive: room.positive,
                negative: room.negative,
            };
            await Stream.findByIdAndUpdate(roomId, streamData, {
                runValidators: true,
                useFindAndModify: true,
            });

            delete room;
        });

        socket.on('join-live', roomId => {
            const room = rooms.roomId;
            if (!room)
                socket.emit('error', 'No stream is available with this id');

            socket
                .to(roomId)
                .emit('notification', 'A new user has been joined');
            room.users.add(getUser(socket.id));
            room.views++;
            room.maxViews = Math.max(room.maxViews, room.views);
            socket.join(roomId);

            socket.emit('get-new-Messages', room.messages);
        });

        socket.on('leave-live', roomId => {
            const room = rooms.roomId;
            room.users.delete(getUser(socket.id));
            room.views--;
            socket.leave(roomId);
        });

        socket.on('send-message', async ({ roomId, content }) => {
            const room = rooms.roomId;
            const user = await getuserInfo(socket.id);
            room.messages.push({ content, userId: user._id, name: user.name });

            io.in(roomId).emit('get-message', {
                content,
                userId: user._id,
                name: user.name,
            });
        });

        socket.on('disconnect', () => {
            console.log('someone disconnected');
            users.delete(getUser(socket.id));
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = { rooms, users };
