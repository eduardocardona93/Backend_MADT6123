const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    address:{type: String,required: true,trim: true,minlength: 3},
    email:{type: String,required: true,trim: true,minlength: 3},
    isAdmin:{type: Boolean,default: false},
    name:{type: String,required: true,trim: true,minlength: 3},
    password:{type: String,required: true,trim: true,minlength: 3},
    phoneNumber:{type: String,required: true,trim: true,minlength: 3},
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;