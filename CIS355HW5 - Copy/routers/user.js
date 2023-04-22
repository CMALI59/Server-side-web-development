const express = require("express")

const User = require("../models/user")
const bcrypt = require('bcrypt')
const router = new express.Router()
const authentication = require("../middleware")

//route to create user into database
router.post('/users/register',async (req, res) => {

  
    const u = new User(req.body)
    try{
        //const to hold the users password
       const pass = u.password;
       //const to hold encrypted password and encrypt password
       const hashed = await bcrypt.hash(pass,8);
       u.password=hashed;
    // saves user to database
    await u.save() 
      
    //const variable to return user response fields without password
    const userresponse = {name:u.name, user_name:u.user_name, balance:u.balance, id:u._id}
    

    
    //user data is sent  
  res.send(userresponse) 
} catch(e){
    res.send(e)
}   
})

router.post('/users/login', async(req, res)=>{
  
    //step 1
    try{
        //const variable to hold user found by username
    const user = await User.findOne({user_name: req.body.user_name})
    if (!user) {
        res.send({msg:"Error logging in incorrect username/password"})
    }
    //step 2
    //const variable to hold encrypted password comparison
    const isMatch = await bcrypt.compare(req.body.password,user.password)

    //step 3
    if (isMatch){
        req.session.user_id = user._id
        //console.log('test')
        res.send({msg: "Successfully logged in. Welcome " + user.name})

    }
    else{
        res.send({msg:"Error logging in incorrect username/password"})


    }
    } catch(e){
        res.send(e)
    }


})


//route to get a user by username
router.get('/users/me', authentication,(req, res) => {

    //returns users information
    const userresponse = {name:req.user.name, user_name:req.user.user_name, balance:req.user.balance, items:req.user.items}
    res.send(userresponse)
   

})

router.post('/users/logout',authentication,async(req,res)=>{
    
    try{
        //destroys session
        await req.session.destroy()
        //sends logout message
        res.send({msg: "Successfully logged out " + req.user.name})
        
    }
    catch(e){
        res.send(e)
    }
})


//route to delete a user by username
router.delete('/users/me',authentication, async(req, res) => {

    try{

        //deletes user when found
        await User.findOneAndDelete({user_name:req.user.user_name})
        //destroys session
        await req.session.destroy()
        //sends message to show deletion
        res.send({msg: "Successfully deleted " + req.user.name})

    }
    catch(e){
        res.send(e)
    }
   
    
})

//route to get summary of database users info
router.get('/summary', async (req, res) => {
   
   try{
    //finds all users and populates their item array with the items they own
    const  summary = await User.find({}).populate('items')
    res.send(summary)
   }
   catch(e){
       res.send(e)
   }
})





module.exports = router