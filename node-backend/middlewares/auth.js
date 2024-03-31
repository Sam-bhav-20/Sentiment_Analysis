const customError = require('../utils/customError');
const catchAsync = require('../middlewares/catchAsync');
const User = require('../models/userModel');

module.exports = catchAsync(async (req, res, next) => {
    const { uid } = req.session;
    if (!uid) throw new customError('Unauthorized access', 401);
    req.user = await User.findById(uid);

    next();
});
