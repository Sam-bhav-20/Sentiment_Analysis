const customError = require('../utils/customError');
const catchAsync = require('../middlewares/catchAsync');
const JWT = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = catchAsync(async (req, res, next) => {
    const { jwt } = req.cookies;
    if (!jwt) throw new customError('Please login to access', 401);

    const data = JWT.verify(jwt, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(data.id);

    // console.log(req.user);
    if (!req.user) throw new customError('Please login to access', 401);
    req.token = jwt;

    next();
});
