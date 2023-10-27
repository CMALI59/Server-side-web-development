
const mongoose = require('mongoose')
const Product = require('./product')


//schema to hold user data
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user_name: { type: String, required:true, unique: true },
    balance: { type: Number, min: 0, default: 100 }
})

//virtual items field to hold products contents
userSchema.virtual('items', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.set('toObject', { virtuals: true })
userSchema.set('toJSON', { virtuals: true })

userSchema.pre('save', function (next) {
    console.log(" A new user is being created in just a moment!")
    next()
})


//post to delete a users items 
userSchema.post('findOneAndDelete', function (user) {
    console.log("Deleting items")
    if (user) {
        //if called all products owned by the user will be deleted 
        Product.deleteMany({ owner: user._id }, (error, result) => {
            if (error)
                console.log("error is", error)
            else
                console.log("deleted", result)
        })
    }

})

const User = mongoose.model('User', userSchema, 'users')



module.exports = User
