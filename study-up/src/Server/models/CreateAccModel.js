const mongoose = require('mongoose')


const createAccountSchema = new mongoose.Schema({
    email: {
        type:String,
        required:true
    },
    username: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    date: {
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("users", createAccountSchema)