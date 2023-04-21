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
    
    const newDate = new Date();
    var date = newDate.toDateString();
    date = date.slice(4);

    data.joinedAt = date;

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


const dashboardDetails = async (req,res) => {

    const {userID,userName} = req.user;

    try {
        const data = await User.findOne({_id : userID});

        return res.status(200).json({msg : data});
    }
    catch (error){
        return res.status(404).json({msg : 'No user found'});
    }
}

const searchFriend = async (req,res) => {


    const {name} = req.body;

    const data = await User.findOne({name : name});

    if (data){
        return res.status(200).json({msg : data});
    }

    return res.status(404).json({msg : `No user found with name ${name}`})
}

const addFriend = async (req,res) => {
    
    const {friendData} = req.body;

    const userID = req.user.userID;

    
    const updatedData = await User.findOneAndUpdate({_id : userID},{friends : [...friends,friendData]});

    if (updatedData){
        return res.status(201).json({msg : 'Friend added'});
    }

    return res.status(403).json({msg : 'Friend not added'});
}   


const getFriends = async (req,res) => {

    const userID = req.user.userID;

    const data = await User.findOne({_id : userID});

    if (data){
        return res.status(200).json({msg : data});
    }
    
    return res.status(404).json({msg : 'No data found'});

}


const getUser = async (req,res) => {

    const {userID} = req.body;

    const data = await User.findOne({_id : userID});

    if (data){
        return res.status(200).json({msg : data});
    }
    return res.status(404).json({msg : 'No data found'});
}

const getUserByName = async (req,res) => {
    const {userName} = req.body;

    const data = await User.findOne({name : userName});

    if (data){
        return res.status(200).json({msg : data});
    }
    return res.status(404).json({msg : 'No data found'});
}
module.exports = {
    loginDetails,
    registrationDetails,
    verifyEmail,
    changePassword,
    dashboardDetails,
    searchFriend,
    addFriend,
    getFriends,
    getUser,
    getUserByName
}   