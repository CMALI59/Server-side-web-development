const express = require("express")
const Post = require("../models/post")

const router = new express.Router()

router.get('/posts',(req,res)=>{
    Post.find({},(error,posts)=>{
        if(error)
            res.send({error:error})
        else{
            const summary = posts.map(post=> ({_id:post._id,title:post.title}))
            res.send(summary)
        }
    })
})
router.get('/posts/search',(req,res)=>{
    console.log(req.query.q)
    const query = new RegExp(req.query.q,"i")
    console.log(query)
    Post.find( {$or:[{title:query },{description: query}]} ,(error,posts)=>{
        if(error)
            res.send({error:error})
        else{
            res.send(posts)
        }
    })
})


router.get('/posts/:id',(req,res)=>{
   
    Post.findById(req.params.id,(error,post)=>{
        if(error)
            res.send({error:error})
        else{
            res.send(post)
        }
    })
})

router.post('/posts',(req,res)=>{
    console.log(req.body)

    let p = new Post(req.body)
    p.save((error,result)=>{
        if(error)
        res.send({error:error})
    else{
        res.send(result)
    }  
    })
   
})


router.delete('/posts/:id',(req,res)=>{
    Post.findByIdAndDelete(req.params.id,(error,response)=>{
        if(error)
            res.send({error:error})
        else{
            if(response)
                res.send({msg:"Post "+req.params.id+" was succesfully deleted."})
            else
            res.send({msg:"Post "+req.params.id+" could not be located."})
        }
    })
})

router.put('/posts/:id',(req,res)=>{
    console.log(req.query)

    Post.findById(req.params.id,(error,post)=>{
        if(error)
            res.send({error:error})
        else{
            if(post){
                
                for (k in req.query)
                    post[k] = req.query[k]
                post.save((error,response)=>{
                    if(error)
                        res.send({error:"Error updating post "+req.params.id})
                    else
                        res.send({msg:"Post "+req.params.id+" was succesfully updated."})
                })
            }
            else
                res.send({msg:"Post "+req.params.id+" could not be located."})
        }
    })

})

module.exports = router