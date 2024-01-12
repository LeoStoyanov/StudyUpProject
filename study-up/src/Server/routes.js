const express = require('express')
const router = express.Router()
const userSchema = require('./models/UserModel')
const newQuizSchema = require('./models/NewQuizModel')
const newFlashSchema = require('./models/newFlashCardModel')
const newNoteSchema = require('./models/newNoteModel')

const md5 = require('md5')

router.post("/getusername", async (req, res) => {
    const user = await userSchema.findOne({
        email: req.body.email
    })
    if (user) {
        return res.json({status: 'ok', username: user.username})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/createaccount", async (req, res) => {
    try {
        let hashedPass = md5(req.body.password);
        const newUser = new userSchema({
            email: req.body.email,
            username: req.body.username,
            password: hashedPass
        })
        await newUser.save()
        res.json({status: "ok"})
    }
    catch(err) {
        res.json({status: "error", error:"Duplicate email"})
    }

})

router.post("/login", async (req, res) => {
    let hashedPass = md5(req.body.password);
    const user = await userSchema.findOne({
        username: req.body.username,
        password: hashedPass
    })
    if (user) {
        return res.json({status: 'ok', user: true, email: user.email})
    }
    else {
        return res.json({status: 'error', user: false})
    }
})

router.post("/newquiz", async (req, res) => {
    try {
        const newQuiz = new newQuizSchema({
            id: req.body.id,
            email: req.body.email,
            quizTitle: req.body.title,
            quizQuestions: req.body.questions
        })
        await newQuiz.save()
        res.json({status: "ok", id: req.body.id})
    }
    catch(err) {
        console.log(err)
    }
})

router.post("/getquiz", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const quizExists = await newQuizSchema.findOne(filter)

    if (quizExists) {
        return res.json({status: 'ok', quizInfo: quizExists})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/updatequiz", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const update = req.body
    const quizExists = await newQuizSchema.findOneAndUpdate(filter, update)

    if (quizExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/deletequiz", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const quizExists = await newQuizSchema.findOneAndDelete(filter)
    if (quizExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/newflash", async (req, res) => {
    try {
        const newFlash = new newFlashSchema({
            id: req.body.id,
            email: req.body.email,
            flashTitle: req.body.title,
            flashCards: req.body.cards
        })
        await newFlash.save()
        res.json({status: "ok", id: req.body.id})
    }
    catch(err) {
        console.log(err)
    }
})

router.post("/getflash", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const flashExists = await newFlashSchema.findOne(filter)

    if (flashExists) {
        return res.json({status: 'ok', flashInfo: flashExists})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/updateflash", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const update = req.body
    const flashExists = await newFlashSchema.findOneAndUpdate(filter, update)

    if (flashExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/deleteflash", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const flashExists = await newFlashSchema.findOneAndDelete(filter)
    if (flashExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})


router.post("/newNote", async (req, res) => {
    try {

        const newNote = new newNoteSchema({
            id: req.body.id,
            email: req.body.email,
            noteTitle: req.body.title,
            note: req.body.note
        })

        await newNote.save()
        res.json({status: "ok", id: req.body.id, title: req.body.title})
    }
    catch(err) {
        console.log(err)
    }
})

router.post("/getNote", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const noteExists = await newNoteSchema.findOne(filter)

    if (noteExists) {
        return res.json({status: 'ok', noteInfo: noteExists})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/updatenote", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }

    const update = req.body
    const noteExists = await newNoteSchema.findOneAndUpdate(filter, update)

    if (noteExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})

router.post("/deletenote", async(req, res) => {
    const filter = {
        id: req.body.id,
        email: req.body.email
    }
    const noteExists = await newNoteSchema.findOneAndDelete(filter)
    if (noteExists) {
        return res.json({status: 'ok'})
    }
    else {
        return res.json({status: 'error'})
    }
})



router.post("/getitems", async(req, res) => {
    const filter = {email: req.body.email}
    // For now, quizzes are implemented on the backend, so find the user's quizzes for now.
    // In the future, send other items as well to the frontend using the same procceses.
    const quizItems = await newQuizSchema.find(filter)
    const flashItems = await newFlashSchema.find(filter)
    const noteItems = await newNoteSchema.find(filter)

    if (quizItems && flashItems && noteItems ) {
        return res.json({status: 'ok', quizItems: quizItems, flashItems: flashItems, noteItems : noteItems})
    }
    else {
        return res.json({status: 'error'})
    }
})

module.exports = router