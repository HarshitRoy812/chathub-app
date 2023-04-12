const User = require('../models/models');
const fs = require('fs');
const path = require('path');
const encryptPassword = require('../validation/encryptPassword');
const {
    userRegistrationSchema,
    userLoginSchema
} = require('../validation/validateSchema');
const verifyPassword = require('../validation/verifyPassword');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const loginDetails = async (req,res) => {


    const {email,password} = req.body;
    var validatedResult;

    try {
        validatedResult = await userLoginSchema.validateAsync({email,password});
    }
    catch (error){
        return res.status(403).json({msg : error.details[0].message});
    }
    const user = await User.findOne({email : validatedResult.email});

    if (!user){
        return res.status(403).json({msg : 'No user with given Email-ID found! Please register'})
    }

    const isValidPassword = await verifyPassword(validatedResult.password,user.password);

    if (!isValidPassword){
        return res.status(403).json({msg : 'Invalid Password!'});
    }

    const token = jwt.sign({userID : user._id,userName : user.name},process.env.SECRET_KEY,{
        'expiresIn' : '30d'
    })

    res.status(200).json({token});



}

const registrationDetails = async (req,res) => {
    
    var validatedResult;
    var isPicPresent;

    if (req.file){
        isPicPresent = true;
    }

    try {
        const {name,email,password} = req.body;
        validatedResult = await userRegistrationSchema.validateAsync({name,email,password});
    }
    catch (error) {
        res.status(403).json({msg : error.details[0].message});
    }

    

    const data = {
        name : validatedResult.name,
        email : validatedResult.email,
        password : validatedResult.password,   
    }

var pic;
    if (isPicPresent){
        pic = {
            data : fs.readFileSync(path.join(__dirname,'..','/uploads',req.file.filename)),
            contentType : 'image/png'
        }
    }

    data.profilePic = pic;

    const userExists = await User.findOne({email : data.email});

    if (userExists){
        return res.status(403).json({msg : 'User already exists! Please log in'});
    }
    else {
        const encryptedPassword = await encryptPassword(data.password);

        data.password = encryptedPassword;

        const user = await User.create(data);
        res.status(201).json({data : user});
    }
}
const verifyEmail = async (req,res) => {

    const emailExists = await User.findOne({email : req.body.email});

    if (!emailExists){
        return res.status(404).json({msg : 'Email address not found!'});
    }
    return res.status(200).json({msg : 'OK'});
}

const changePassword = async (req,res) => {

    var data = {};

    const encryptedPassword = await encryptPassword(req.body.password);

    data.password = encryptedPassword;

    const response = await User.findOneAndUpdate({email : req.body.email},data)

    if (!response){
        return res.status(403).json({msg : 'Could not change password'})
    }

    return res.status(203).json({msg : 'Your password has been changed successfully !'});

}

module.exports = {
    loginDetails,
    registrationDetails,
    verifyEmail,
    changePassword
}   