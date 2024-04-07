const { OAuth2Client } = require('google-auth-library');
const customError = require('../utils/customError');
const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/userModel');
const Stream = require('../models/streamModel');

exports.signup = catchAsync(async (req, res) => {
    console.log(req.body);
    const user = await User.create(req.body);

    req.session.uid = user._id;
    // res.redirect(`${process.env.CLIENT_URL}/home`)
    res.status(200).json({
        message: 'You have successfully registered',
        data: { user },
    });
});

exports.login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new customError('Please provide all credentials', 401);

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        // res.redirect(`${process.env.CLIENT_URL}/signup`)
        throw new customError("User doesn't exist", 401);
    }

    const compare = await user.passwordCompare(password);
    if (!compare) throw new customError("Password didn't match", 401);

    req.session.uid = user._id;

    // res.redirect(`${process.env.CLIENT_URL}/home`)
    res.status(200).json({
        message: 'You have successfully logged in',
        // data: { user },
    });
});

exports.logoutSingle = catchAsync(async (req, res) => {
    if (req.session.uid) {
        req.session.destroy(err => {
            if (err) throw err;
            res.clearCookie('connect.sid');
            // res.redirect(`${process.env.CLIENT_URL}/login`)

            return res.status(200).json({ msg: 'logging you out' });
        });
    } else return res.status(200).json({ msg: 'no user to log out!' });
});

exports.logoutAll = catchAsync(async (req, res) => {
    req.sessionStore.destroy(req.sessionID, err => {
        if (err) throw err;
        res.clearCookie('connect.sid');
        // res.redirect(`${process.env.CLIENT_URL}/login`)
    });
    res.status(200).json({
        message: 'You have successfully logged out from this device',
    });
});

exports.loginWithGoogle = catchAsync(async (req, res) => {
    const { credential } = req.body;
    const googleClient = new OAuth2Client({
        clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    });

    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audient: `${process.env.GOOGLE_CLIENT_ID}`,
    });

    const payload = ticket.getPayload();
    console.log(payload);

    const user = await User.findOne({ email: payload?.email });
    if (!user) throw new customError("You don't have an account.", 401);

    user.googleAvatar = payload.picture;
    await user.save();

    req.session.uid = user._id;

    // res.redirect(`${process.env.CLIENT_URL}/home`)
    res.status(200).json({
        message: 'You have successfully logged in',
        // data: { user },
    });
});

exports.getDetailsById = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id).populate(
        'streams followers followings'
    );
    if (!user) throw new customError('User not found', 404);

    res.status(200).json({
        data: { user },
    });
});

exports.updateProfile = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: true,
    });

    res.status(200).json({
        message: 'Profile has been updated successfully',
        data: { user },
    });
});

exports.followUnfollow = catchAsync(async (req, res) => {
    const requestedUser = await User.findById(req.params.id);
    const user = await User.findById(req.id);
    if (!requestedUser) throw new customError('User not found', 404);

    let msg;
    if (user.followings.includes(requestedUser._id)) {
        user.followings.splice(user.followings.indexOf(requestedUser._id), 1);
        requestedUser.followers.splice(
            requestedUser.followers.indexOf(user._id),
            1
        );

        await user.save();
        await requestedUser.save();
        msg = 'User has been unfollowed';
    } else {
        user.followings.push(requestedUser._id);
        requestedUser.followers.push(user._id);

        await user.save();
        await requestedUser.save();
        msg = 'User has been followed';
    }
    res.status(200).json({
        message: msg,
        data: { user, requestedUser },
    });
});

exports.deleteProfile = catchAsync(async (req, res) => {
    const user = await User.findById(req.id);

    const streams = user.streams;
    for (let i = 0; i < streams.length; i++) {
        const stream = await Stream.findById(streams[i]);
        await stream.remove();
    }

    const followers = user.followers;
    for (let i = 0; i < followers.length; i++) {
        const follower = await User.findById(followers[i]);
        follower.followings.spilce(follower.followings.indexOf(user._id), 1);
        await follower.save();
    }

    const followings = user.followings;
    for (let i = 0; i < followings.length; i++) {
        const following = await User.findById(followings[i]);
        following.followers.spilce(following.followers.indexOf(user._id), 1);
        await following.save();
    }

    req.sessionStore.destroy(req.sessionID, err => {
        if (err) throw err;
        res.clearCookie('connect.sid');
    });
    await user.remove();

    // res.redirect(`${process.env.CLIENT_URL}/home`)
    res.status(200).json({ message: 'Your profile has been deleted' });
});

exports.searchUser = catchAsync(async (req, res) => {
    let users;
    if (req.params.keyword) {
        users = await User.find({
            name: {
                $regex: req.params.keyword,
                $options: 'i',
            },
        });
    }
    res.status(200).json({ users });
});
