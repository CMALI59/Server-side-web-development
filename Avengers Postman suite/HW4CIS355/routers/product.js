const express = require('express')


const Product = require("../models/product")
const User = require("../models/user")

const router = new express.Router()

//route to create product in database
router.post('/products', (req, res) => {
    //finds user in database that owns item based on the seller username provided in the request 
    User.find({ user_name: req.body.seller }, (error, user) => {
        //if error, error is sent
        if (error)
            res.send({ error: error })
        else {
            //sets _id to id of the seller found in the user database
            let _id = user[0]._id
            //creates variabale  to new product
            let product = new Product(
                //sets information to hold a products details and add owners id
                {
                    name: req.body.name,
                    price: req.body.price,
                    owner: _id
                }
            )
            //saves product in database
            product.save((error, response) => {
                //if error, error is sent
                if (error)
                    res.send({ error: error })
                else
                //sends product information
                    res.send(response)
            })
        }

    })
})


//route to get all products in database
router.get('/products', (req, res) => {
    //finds all products in database
    Product.find({}, (error, products) => {
        //if error, error is sent
        if (error)
            res.send({ error: error })
        else {
            //creates array to hold all products
            let allproducts = []
            //sets loop for each product in the products collection
            for (let product of products) {
                //sets const to convert product object
                const p = product.toObject()
                //puts product object into array
                allproducts.push(p)
            }
            //sends all products from collection 
            res.send(allproducts)

        }
    })
})


//route to handle the purchasing of a product 
router.post('/products/buy', (req, res) => {
    //console.log(req.body)
    //finds product by id provided in the request
    Product.findById(req.body.productID, (error, product) => {
        //if error, error is sent
        if (error)
            res.send({ error: error })
        else {
            //finds user with username provided by request as the buyer
            User.find({ user_name: req.body.user_name }, (error, buyer) => {
                //sets buyer to buyer object
                buyer = buyer[0]
                //if error, error is sent
                if (error)
                    res.send({ error: error })
                else {
                    //finds user in database that owns the item
                    User.findById(product.owner, (error, seller) => {
                        //if error, error is sent
                        if (error)
                            res.send({ error: error })
                        else {
                            //condition statement to make sure the buyer of the item doesn't own the item
                            if (buyer.user_name == seller.user_name)
                            //sends alert that buyer owns the item already
                                res.send({ msg: 'Oops,' + buyer.name + 'already owns this item' })
                            else {
                                //condition statement to check if the buyers balance is less than the price of the item they are requesting to buy
                                if (buyer.balance < product.price)
                                //sends alert that the buyer doesn't have the needed funds for purchasing the item
                                    res.send({ msg: 'Oops,' + buyer.name + 'has insufficient funds' })
                                else {
                                    
                                    buyer.balance = buyer.balance - product.price               //sets buyers balance to reflect purchase
                                    seller.balance = product.price + seller.balance             //sets sellers balance to reflect purchase
                                    product.owner = buyer._id                                   //sets product owner id to the id of the buyer
                                    
                                    //saves updates
                                    buyer.save()
                                    seller.save()
                                    product.save()
                                    
                                    //sends alert that transaction was successful
                                    res.send({ msg: "Transaction successful!" })
                                }
                            }
                        }
                    })
                }
            })
        }
    })
})

//route to delete product based on product id
router.delete('/products/:id', (req, res) => {
    //finds product based on provided id and deletes it
    Product.findByIdAndDelete(req.params.id, (error, response) => {
        //if error, error is sent
        if (error)
            res.send({ error: error })
        else {
            if (response)
                res.send({ msg: "Item " + req.params.id + " was successfully deleted." })
            else
                res.send({ msg: "Item " + req.params.id + " could not be located." })
        }
    })
})


module.exports=router