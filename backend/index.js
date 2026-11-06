require('dotenv').config({path:'.env'})
const cors = require('cors')
const express = require('express')
const fileUp = require('express-fileupload')
const path = require('path')
const app = express()

app.use(cors({
    origin:'http://localhost:3000',
    credentials: true
}))
app.use(express.json())
app.use(fileUp())
app.use('/uploads',express.static(path.join(__dirname,'./uploads')))

const auth = require('./routes/auth')
app.use('/api/auth',auth)

const profile = require('./routes/profile')
app.use('/api/profile',profile)

const dash = require('./routes/dash')
app.use('/api/dash',dash)

const docnoe = require('./routes/docnoe')
app.use('/api/docnoe',docnoe)



//----------------------------------------------eva api --------------------------------------------------------------\\

const selfeva = require('./routes/Eva/selfeva')
app.use('/api/Eva/selfeva',selfeva)

const edit_eva = require('./routes/Eva/edit_eva')
app.use('/api/Eva/edit_eva',edit_eva)

const score_member = require('./routes/Eva/score_member')
app.use('/api/Eva/score_member',score_member)

const score_commit = require('./routes/Eva/score_commit')
app.use('/api/Eva/score_commit',score_commit)

const table = require('./routes/Eva/table')
app.use('/api/Eva/table',table)
//----------------------------------------------commit api --------------------------------------------------------------\\

const show_eva = require('./routes/Commit/show_eva')
app.use('/api/Commit/show_eva',show_eva)

const check = require('./routes/Commit/check')
app.use('/api/Commit/check',check)

const score_commit2 = require('./routes/Commit/score_commit')
app.use('/api/Commit/score_commit',score_commit2)

const signature = require('./routes/Commit/signature')
app.use('/api/Commit/signature',signature)



app.use((req,res)=> res.status(404).json({message:"Route Not Found"}))
app.listen(3001,()=>{
    console.log("Server Running on Port 3001");
    
})