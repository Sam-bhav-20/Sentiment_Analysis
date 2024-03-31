const express = require('express');
const {
    signup,
    login,
    logoutSingle,
    logoutAll,
    loginWithGoogle,
    updateProfile,
    getDetailsById,
    deleteProfile,
    searchUser,
    followUnfollow,
} = require('../controllers/userControllers');
const auth = require('../middlewares/auth')

const router = express();

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/login/google').post(loginWithGoogle);

router.route('/logout/single').get(logoutSingle);
router.route('/logout/all').get(logoutAll);

router.route('/user/:id').get(getDetailsById)
router.route('/update/user').patch(auth, updateProfile)
router.route('/delete/user').delete(auth, deleteProfile)

router.route('/user/follow/:id').get(auth, followUnfollow)

router.route('/search/user/:keyword').get(searchUser)

module.exports = router;