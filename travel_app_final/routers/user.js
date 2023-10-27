const express = require("express")

const User = require("../models/user")
const Post = require('../models/post')

const router = new express.Router()

router.post('/users/dummy',(req,res)=>{
    createDummyData()
    User.find({}).populate('posts').exec((error,result)=>{
        if(error)
            res.send({error:error})
        else
            res.send(result)
    })
})
router.post('/users',(req,res)=>{
    const u = new User(req.body)
    u.save((error,response)=>{
        if(error)
                res.send({error:error})
                else{
                    console.log(response)
                   
                    res.send(response)
                }
    })
})

router.get('/users/:id',(req,res)=>{
    
    User.findById(req.params.id).populate('posts').exec((error,user)=>{
        if(error)
            res.send({error:error})
        else{
            
            console.log(user)
            res.send(user)
        }
    })
})



router.get('/users',(req,res)=>{
    
    User.find({}).populate('posts').exec((error,users)=>{
        if(error)
            res.send({error:error})
        else{
            let allusers=[]
            for (let user of users){
                const u = user.toObject()
                u.posts = u.posts.length
                allusers.push(u)
            }
            res.send(allusers)
            
           

        }
    })
})

router.delete('/users/all',(req,res)=>{
    User.find({},(error,users)=>{
        if(error)
            res.send({error:error})
        else{
            for (let u of users){
                User.findByIdAndDelete(u._id,(error,result)=>{
                    if(error)
                        console.log(error)
                    else
                        console.log(result)
                    
                })
            }
            res.send(users)

        }
    })
})

router.delete('/users/:id',(req,res)=>{
    
    User.findByIdAndDelete(req.params.id,(error,user)=>{
        if(error)
            res.send({error:error})
        else{
            if(!user)
                res.send({msg:"could not locate user "+req.params.id})
            else
                res.send(user)
        }
    })
})

function createDummyData(){
    const u1  = new User({name:"john",email:"j@j.com"})
    const u2  = new User({name:"peter",email:"p@p.com"})
    const u3  = new User({name:"mary",email:"m@m.com"})

    u1.save()
    u2.save()
    u3.save()



    const p1 = new Post({
        title:"Weekend Trip to the Big Apple",
        description:"Visited the Empire State Building",
        rating:8,
        lat:40.74861116670957,
        lon: -73.98537472313336,
        dateVisited: new Date("05/01/2022"),
        imageURL:"https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg",
        author:u1.id
    })

    p1.save()

    const p2 = new Post({
        title:"Summer Trip to Las Vegas",
        description:"Fountains of Bellagio",
        rating:7,
        lat:36.113153496516844, 
        lon: -115.17599171768819,
        dateVisited: new Date("07/01/2022"),
        imageURL: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Night_mode_2_Bellagio.jpg",
        author:u2.id


    })

    p2.save()

    const p3 = new Post({
        title:"Hiking in Arizona",
        description:"Grand Canyon National Park",
        rating:10,
        lat:36.06199880326642, 
        lon: -112.10778594184717,
        dateVisited: new Date("06/13/2022"),
        imageURL:"https://upload.wikimedia.org/wikipedia/commons/a/aa/Dawn_on_the_S_rim_of_the_Grand_Canyon_%288645178272%29.jpg",
        author:u3.id

    })

    p3.save()

}

module.exports=router