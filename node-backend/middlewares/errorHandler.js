const customError = require('../utils/customError');

module.exports = (err, req, res, next) => {
    // Invalid ID Error
    if (err.name === 'CastError') {
        const msg = `Resource Not Found. Invalid: ${err.path}`;
        err = new customError(msg, 400);
    }

    // MongoDB Duplicate key Error
    if (err.code === 11000) {
        const msg = `${Object.values(err.keyValue)} already exists`;
        err = new customError(msg, 400);
    }

    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const msg = Object.values(err.errors)[0].message;
        err = new customError(msg, 400);
    }

    // Invalid JWT Error
    if (err.name === 'JsonWebTokenError')
        err = new customError('Please login to access', 400);

    if (process.env.NODE_ENV == 'production') {
        // Other Errors
        if (!err.operational) {
            err = { ...err, message: 'Something went wrong', statuscode: 500 };
        }
        res.status(err.statuscode).json({
            status: 'fail',
            message: err.message,
            error: err,
        });
    } else {
        console.log(err);
        res.json({ err: err.message });
    }
};
