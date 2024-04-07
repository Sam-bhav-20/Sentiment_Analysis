const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    streamer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    thumbnail: String,
    thumbUrl: String,
    heldOn: {
        type: Date,
        default: new Date(),
        validate: {
            validator: v => {
                return v.getTime() >= Date.now();
            },
            message: 'Enter valid a date for your stream',
        },
    },
    maxViews: Number,
    positive: Number,
    negative: Number,
});

module.exports = mongoose.model('stream', streamSchema);
