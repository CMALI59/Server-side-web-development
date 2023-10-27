const express = require('express')
const router = new express.Router()
const User = require('../models/user')

//route to create user into database
router.post('/users', (req, res) => {
    //sets const variable equal to the body of the request
    const u = new User(req.body)
    // saves user to database                                
    u.save((error, response) => {                               
        if (error)                                             
         // if error, error is sent 
            res.send({ error: error })
        else {
            console.log(response) 
            //user data is sent  
            res.send(response)                                   
        }
    })
})



//route to get all users in database
router.get('/users', (req, res) => {
    //locates all users in database
    User.find({}, (error, users) => {
        //if error, error is sent
        if (error)
            res.send({ error: error })
        else {
            //creates array to hold all users
            let allusers = []
            //sets loop for each individual user in users collection
            for (let user of users) {
                //sets constant to convert user into object
                const u = user.toObject()
                //adds user object to array
                allusers.push(u)
            }
            //sends all users
            res.send(allusers)



        }
    })
})


//route to get a user by username
router.get('/users/:user_name', (req, res) => {

    //finds user in database by username and populates its items array with items it owns
    User.find(req.params).populate('items').exec((error, user) => {
        console.log(error, user)
        //if error error is sent
        if (error)
            res.send({ error: error })
        else
        //sends specified user information
            res.send(user)
    })

})


//route to delete a user by username
router.delete('/users/:user_name', (req, res) => {

    //finds user with username
    User.find(req.params, (error, user) => {
        //sets user object to the value of the first index of the response  which is the user field
        user = user[0]
        //if error error is sent
        if (error)
            return res.send({ error: error })
        //if user is not found message alerting, that the user could not be locate is sent
        if (!user)
            return res.send({ msg: "could not locate user " + req.params.id })
        //finds user by user name and deletes them from the database
        User.findByIdAndDelete(user.id, (error, user) => {
            //if error, error is sent
            if (error) return res.send({ error: error })
            return res.send("Deleted " + user)
        })

    });
})

//route to get summary of database users info
router.get('/summary', (req, res) => {
    //finds all users and populates their item array with the items they own
    User.find({}).populate('items').exec((error, user) => {
        console.log(error, user)
        //if error,error is sent
        if (error)
            res.send({ error: error })
        else
        //all user info is sent 
            res.send(user)
    })
})


module.exports = router