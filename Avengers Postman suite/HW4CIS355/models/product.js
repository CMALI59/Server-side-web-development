
const mongoose = require('mongoose')

//schema to hold product data
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const Product = mongoose.model('Product', productSchema, 'products')
module.exports = Product