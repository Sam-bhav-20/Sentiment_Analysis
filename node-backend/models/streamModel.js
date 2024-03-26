const mongoose = require('mongoose')

const streamSchema = new mongoose.Schema({
    streamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    maxViews: Number,
    positive: Number,
    negative: Number,
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'chat',
        }
    ]
})

module.exports = mongoose.model('stream', streamSchema)