const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name must be required'],
            trim: true,
            validate: {
                validator: function (val) {
                    return /^[A-Za-z\s]*$/.test(val);
                },
                message: 'Name should contain only alphabets and spaces',
            },
        },
        email: {
            type: String,
            required: [true, 'Email must be required'],
            unique: [true, 'Email already exists'],
            trim: true,
            validate: [validator.isEmail, 'Enter a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password must be required'],
            select: false,
        },
        avatar: String,
        googleAvatar: String,
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
        followings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
        streams: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'stream',
            },
        ],
        // nextStream:
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false,
        },
    }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password'))
        this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.passwordCompare = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
