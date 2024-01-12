const express = require('express')
const app = express()
const mognoose = require('mongoose')
const routeURLS = require('./routes')
const cors = require('cors')
const path = require('path')
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'client/build')))

const dbURI = process.env.MONGODB_URI;
mognoose.connect(dbURI).then((result) => {
    console.log("Connected to Database!")
    app.use(express.json())
    app.use(cors())
    app.use('/app', routeURLS)  
}).catch((err) => {
    console.log(err)
})

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
})
app.listen(4000, () => console.log("Server is running!"))
