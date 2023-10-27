const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')

const userRouter = require('./routers/user')
const productRouter = require('./routers/product')

const port = 3000;
app.listen(port)
console.log("Starting server on Port 3000")

/* Express Configuration and Setup */
app.use(express.urlencoded({extended:true})); // this middleware is essential for express to parse data coming in from post requests
app.use(express.static(path.join(__dirname,'public'))) //this middleware tells express where to serve static assets from
app.set('views',path.join(__dirname,'views')) // this tells express where to look for templates when using res.render
app.set('view engine','ejs') // this tells express what template engine to use eg. pug,hbs ejs etc.
app.use(express.json())

app.use(userRouter)
app.use(productRouter)

/* Mongoose 6.10.0 Config and Setup */
const mongoURL = "mongodb+srv://ckmallin:Rover9819@cluster0.zmtid.mongodb.net/infinity-market?retryWrites=true&w=majority'"
mongoose.connect(mongoURL,{ useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
    if(err)
        console.log("Could not connect to database",err)
    else
        console.log("Connected to DB..")
})




