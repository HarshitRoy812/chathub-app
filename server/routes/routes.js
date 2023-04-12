const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({dest : 'uploads/'});

const {
    loginDetails,
    registrationDetails,
    verifyEmail,
    changePassword
} = require('../controllers/controller');

router.route('/login').post(loginDetails);
router.route('/register').post(upload.single("profile_pic"),registrationDetails);
router.route('/verifyEmail').post(verifyEmail);
router.route('/changePassword').post(changePassword);

module.exports = router;