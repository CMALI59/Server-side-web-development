const User = require("./models/user")
const Product = require("./models/product")


async function authenticateUser(req,res,next){
    if(!req.session.user_id){
        res.send({msg: "This page requires you to be logged in"})
        return res.redirect('/')
    }
    else{
        try {
            const user = await User.findById(req.session.user_id).populate('items')
            req.user = user
            next()
        }
        catch(e){
            res.send(e)
        }
        
    }
}

module.exports = authenticateUser