const mongoose = require('mongoose')

const newNoteSchema = new mongoose.Schema({
    id: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
    },
    noteTitle: {
        type:String,
        required:true,
    },
    noteEditor: {
        type:Array,
        required:true
    }
})

module.exports = mongoose.model("notes", newNoteSchema)
