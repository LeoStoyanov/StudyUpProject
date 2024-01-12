const mongoose = require('mongoose')


const newQuizSchema = new mongoose.Schema({
    id: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    quizTitle: {
        type:String,
        required:true
    },
    quizQuestions: {
        type:Array,
        required:true
    }
})

module.exports = mongoose.model("quizzes", newQuizSchema)