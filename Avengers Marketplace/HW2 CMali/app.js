const { addUser, buyItem } = require('./HW1.js')
const fs = require('fs');
const express = require('express')
const app = express()
const path = require('path')
const port = 3000;
app.listen(port)
console.log("Starting server on Port 3000")

app.use(express.urlencoded({extended:true})); // this middleware is essential for express to parse data coming in from post requests
app.use(express.static(path.join(__dirname,'public'))) //this middleware tells express where to serve static assets from
app.set('views',path.join(__dirname,'views')) // this tells express where to look for templates when using res.render
app.set('view engine','ejs') // this tells express what tempalte engine to use eg. pug,hbs ejs etc.

function acceptUsers() {

    let inputFile = fs.readFileSync('users.json').toString()            //sets input variable to filestream
    let users = JSON.parse(inputFile)                                   //sets users to be parsed for input
    return users
}

// Home Route
app.get('/',(req,res)=>{
   res.render('homepage.ejs')
    
})

//login route for existing users
app.post('/login',(req,res)=>{
    
    let users = acceptUsers()                                       //reads in users and assigns them to users variable

    let userName = req.body.userName                                //gets username from input user
    console.log(userName)                                          //prints username out to console
    let exists = false
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].userName === req.body.userName) {             //Login route, check if the name exists and if so redirect to page, else go to homepage
            exists = true;
        }
    }

        if(exists === true){                                       //condition statement to check if user name is valid
            res.redirect('/user/' + userName)
            } else {
                res.redirect('/')
            }
})

//register route for creating a new user 
app.post('/register',(req,res)=>{
    
    let users = acceptUsers()                               //reads in users and assigns them to users variable

    let exists = false;                                     //sets variable to false to check for existing user

    console.log(req.body.userName)

    //loops through users to get username
    for (let i = 0; i < users.length; i++) {
        if (users[i].userName === req.body.userName) {      //condition to check if username exist
            exists = true;                                  //changes varible to tru for later code execution
            break;  
        }

    }

    if (exists== false) {                                          //condition set to false if user doesnt exist user is created and page redirection invoked
        addUser({ userName: req.body.userName, name: req.body.name, balance: req.body.balance })
        console.log("hello")
        res.redirect('/user/' + req.body.userName)
    }
    else {
        res.redirect('/')                                   //if user does exist page is simply refreshed
    }
})

//Dynamic Route for rendering user page
app.get('/user/:userName',(req,res)=>{
    
    let users = acceptUsers()                                       //reads in users and assigns them to users variable

    let userName = req.params.userName                              //gets username from input user

   // console.log(userName)
    let user = null;
    //loops through users to get username
    for (let i = 0; i < users.length; i++) {
        if (users[i].userName === userName) {
            user = users[i]
            users.splice(i, 1);                                 //removes user from other users
        }
    }

    res.render('users.ejs', { users: users, user: user })       //renders user page
})


//buy route for purchasing items
app.post('/buy', (req,res)=>{
    console.log(req.body)
    buyItem({id: Number(req.body.id), buyer: req.body.buyer})
    res.redirect('/user/' + req.body.buyer)                 //refeshes page to show updated user page
})





