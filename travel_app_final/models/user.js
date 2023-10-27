
const mongoose = require('mongoose')
const Post = require('./post')

const userSchema = new  mongoose.Schema({
    name:{type:String, required:true},
    user_name:{type:String, unique:true},
    balance:{type:Number, min:0, default:100}
})

userSchema.virtual('items',{
    ref:'items',
    localField:'_id',
    foreignField:'owner'
})

userSchema.set('toObject',{virtuals:true})
userSchema.set('toJSON',{virtuals:true})

userSchema.pre('save',function(next){
    console.log(" A new user is beng created in just a moment!")
    next()
})

userSchema.post('findOneAndDelete',function(user){
    console.log("Inside post hook for delete")
    if(user){
        Post.deleteMany({author:user._id},(error,result)=>{
            //console.log(result)
            if(error)
                console.log("error is",error)
            else
                console.log("result is",result)
        })
    }
    
})

const User = mongoose.model('User',userSchema,'users')



module.exports = User
