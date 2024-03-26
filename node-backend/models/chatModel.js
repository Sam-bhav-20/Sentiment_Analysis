const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: [true, 'Need to type something...']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    timestamps: { 
        createdAt: true, 
        updatedAt: false 
    }
})

module.exports = mongoose.model('chat', chatSchema)