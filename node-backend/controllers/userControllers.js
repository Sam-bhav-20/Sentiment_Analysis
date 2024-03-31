const User = require('../models/userModel');
const customError = require('../utils/customError');
const catchAsync = require('../middlewares/catchAsync');
const { OAuth2Client } = require('google-auth-library');

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

    if (!user.avatar) {
        user.avatar = payload.picture;
        user.googleAvatar = true;
        await user.save();
    }

    req.session.uid = user._id;

    // res.redirect(`${process.env.CLIENT_URL}/home`)
    res.status(200).json({
        message: 'You have successfully logged in',
        // data: { user },
    });
});
