const express = require('express');
const {
    signup,
    login,
    logoutSingle,
    logoutAll,
    loginWithGoogle,
} = require('../controllers/userControllers');

const router = express();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/login/google').post(loginWithGoogle);

router.route('/logout/single').get(logoutSingle);
router.route('/logout/all').get(logoutAll);

module.exports = router;
