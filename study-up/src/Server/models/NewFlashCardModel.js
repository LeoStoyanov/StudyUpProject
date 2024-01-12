const mongoose = require('mongoose')

const newFlashCardSchema = new mongoose.Schema({
    id: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    flashTitle: {
        type:String,
        required:true
    },
    flashCards: {
        type:Array,
        required:true
    }
})

module.exports = mongoose.model("flashcards", newFlashCardSchema)
