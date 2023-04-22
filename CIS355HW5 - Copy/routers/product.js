const express = require("express")
const res = require("express/lib/response")
const Product = require("../models/product")
const User = require("../models/user")
const authentication = require("../middleware")
const router = new express.Router()


//route to get all products in database
router.get('/products', async (req, res) => {
   
   try{ //finds all products in database
    const products = await Product.find({})
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
        catch(e){
            res.send(e)
        }

})

//route to create product in database
router.post('/products', authentication, async(req, res) => {
  
    try{       
    //creates varibale  to new product
            let product = new Product(
                //sets information to hold a products details and add owners id
                {
                    name: req.body.name,
                    price: req.body.price,
                    owner: req.user._id
                }
            )
            //saves product in database
           let productresponse = await product.save()
    
                    res.send(productresponse)

            }
            catch(e){
                res.send(e)
            }
     
})

//route to handle the purchasing of a product 
router.post('/products/buy', authentication, async(req, res) => {
   
    try{
     //const to hold the product finds product by id provided in the request
        const product = await Product.findById(req.body.productID)
        //const to hold the buyer found by the session userid
        const buyer = await User.findById(req.session.user_id)
       //const to hold the seller found by the product id 
        const seller = await User.findById({_id:product.owner}) 
        //console.log(seller)


         if (buyer.user_name == seller.user_name){
                            //sends alert that buyer owns the item already
            res.send({ msg: 'Oops,' + buyer.name + 'already owns this item' })
         } else {
                                //condition statement to check if the buyers balance is less than the price of the item they are requesting to buy
            if (buyer.balance < product.price){
                                //sends alert that the buyer doenst have the needed funds for purchasing the item
                                    res.send({ msg: 'Oops,' + buyer.name + 'has insuffiecent funds' })
                                } else {
                                    
                                    buyer.balance = buyer.balance - product.price               //sets buyers balance to reflect purchase
                                    seller.balance = product.price + seller.balance             //sets sellers balance to reflect purchase
                                    product.owner = buyer._id                                   //sets product owner id to the id of the buyer
                                    
                                    //saves updates
                                    await buyer.save()
                                    await seller.save()
                                    await product.save()
                                    
                                    //sends alert that transaction was successful
                                    res.send({ msg: "Transaction successful!" })
                                }
    }
}       catch(e){
    res.send(e)
}
})

//route to delete product based on product id
router.delete('/products/:id',authentication, async (req, res) => {
    //finds product based on provided id and deletes it
   const product = await Product.findById(req.params.id)
//condition statement to check if the product owner is the logged in user
if(product.owner.equals(req.user._id)){
    try{
        //const to hold the found item that is deleted
        const response = await Product.findByIdAndDelete(req.params.id)
        if (response)
            res.send({ msg: "Item " + response.name + " was succesfully deleted." })
        else
            res.send({ msg: "Item " + response.name + " could not be located." })

    }
    catch(e){
        //sends error
        res.send(e)
    }

           
} else {
    //sends message alerting authentication
    res.send({msg: "You are not authorized to perform this operation"})
    }
    
})



module.exports = router