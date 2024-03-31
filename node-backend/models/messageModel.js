const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
            required: [true, 'Need to type something...'],
        },
        // streamId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'stream',
        // },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

module.exports = mongoose.model('message', messageSchema);
