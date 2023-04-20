const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    gender : String,
    profilePic : {
        data : Buffer,
        contentType : String
    },
    joinedAt : String,
    friends : [{type : Schema.Types.ObjectId,ref : 'User'}]
})

const userModel = mongoose.model('User',userSchema);

module.exports = userModel;