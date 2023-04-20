const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({dest : 'uploads/'});

const {
    loginDetails,
    registrationDetails,
    verifyEmail,
    changePassword,
    dashboardDetails,
    searchFriend,
    addFriend,
    getFriends,
    getUser
} = require('../controllers/controller');

const authorize = require('../authorize/authorize');

router.route('/login').post(loginDetails);
router.route('/register').post(upload.single("profile_pic"),registrationDetails);
router.route('/verifyEmail').post(verifyEmail);
router.route('/changePassword').post(changePassword);
router.route('/dashboard').get(authorize,dashboardDetails);
router.route('/searchFriend').post(authorize,searchFriend);
router.route('/friend').put(authorize,addFriend).get(authorize,getFriends);
router.route('/getUser').post(authorize,getUser);

module.exports = router;