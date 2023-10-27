
const mongoose = require('mongoose')
const itemsSchema  = new mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const item = mongoose.model('Item',itemsSchema,'items')
module.exports = item