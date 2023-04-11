const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    gender : String,
    profilePic : {
        data : Buffer,
        contentType : String
    }
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;