const mongoose = require("mongoose");
const validator = require('validator');

const messageSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain At Least 3 Characters!"],
    },
    lastname: {
        type:String,
        require:true,
        minLength:[3, "Last Name Must Contain At Least 3 Characters!"],
    },
    email: {
        type:String,
        require:true,
        validator: [validator.isEmail, "Provide A Valid Email!"],
    },
    phone: {
        type:String,
        require:true,
        minLength: [9, "Phone Number Must Contain Exact 11 Digits!"],
        maxLength: [9, "Phone Number Must Contain Exact 11 Digits!"],
    },
    message: {
        type:String,
        require: true,
        minLength: [10, "Message Must Contain At Least 10 Characters!"],
    },
})

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;