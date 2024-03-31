const customError = require('../utils/customError');
const catchAsync = require('../middlewares/catchAsync');

module.exports = catchAsync(async (req, res, next) => {
    const { uid } = req.session;
    if (!uid) throw new customError('Unauthorized access', 401);
    req.id = uid;

    next();
});
