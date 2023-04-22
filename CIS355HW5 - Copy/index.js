require('dotenv').config()
const express = require("express")
const path = require('path')
const mongoose = require('mongoose')
const productRouter = require("./routers/product")
const userRouter = require("./routers/user")
const session = require('express-session')
const MongoStore = require('connect-mongo')


const app = express()
const port = process.env.PORT
app.listen(port)


app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

const url = process.env.MONGO_URL
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("Connected to DB.."))
.catch((err)=>console.log("Could not connect to database",err))

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: url
    })
}))

app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(express.json())
app.use(productRouter)
app.use(userRouter)


