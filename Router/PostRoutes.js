const express = require('express')
const fetchUser = require('../Middleware/FetchUser.js')
const Post = require('../Schemas/Posts.js');
const User = require('../Schemas/User.js');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/createpost', fetchUser, async (req, res) => { //create a new post

    try {

        const { title, description } = req.body;
        const userId = req.id;
        const userPostingThePost = await User.findById(userId);
        const initialsOfUser = userPostingThePost.FirstName[0]+userPostingThePost.LastName[0]
        const name = userPostingThePost.FirstName + " " + userPostingThePost.LastName
        const date_time = new Date();
        const date = date_time.toLocaleDateString();
        const newPost = new Post({
            title,
            description,
            initials: initialsOfUser,
            username: name,
            dateTime : date,
            User: req.id
        })
        const savedPost = await newPost.save()
        res.status(200).json({savedPost});


    } catch (error) {
        console.log(error)
    }
})

router.get('/userposts', fetchUser, async (req, res) => {  //fetch User Posts


    try {

        const userId = req.id;
        const userPosts = await Post.find({User: userId})
        res.send(userPosts)

    } catch (error) {
        console.log(error)
    }


})

router.get('/allposts', async (req,res) =>{ // fetch all posts
    try{

        const allPosts = await Post.find();
        res.status(200).json({allPosts})

    }catch(error){

        console.log(error)

    }
})

router.put('/allposts/:postId/like', fetchUser, async (req,res) =>{ // For Likes
    try{

        const userId = req.id;
        const postId = req.params.postId;
        
        const authtoken = req.header('auth-token')
        const token = authtoken.toString()
        const user = await User.findById(userId)
        const name = `${user.FirstName} ${user.LastName}`
        const post = await Post.findById(postId)
        if(!post){
            res.status(401).send("Post not found")
        }

        if(post.likes.includes(userId)){
            await Post.updateOne({_id: postId}, {$pull : {likes : userId}});
            await Post.updateOne({ _id: postId }, { $pull: { likedby: name } });
            const savedPost = await Post.findById(postId)
            res.status(200).json({savedPost,token})

           
        }

        else{
            await Post.updateOne({_id: postId}, {$push : {likes : userId}});
            await Post.updateOne({ _id: postId }, { $push: { likedby: name } });
            const savedPost = await Post.findById(postId)
            res.status(200).json({savedPost,token})
          
        }

    }catch(error){

        console.log(error)

    }
})

router.get('/likes/:postId',async(req,res) =>{
    try{


        const post = await Post.findById(req.params.postId)
        res.status(200).json(post.likedby)

    }catch(error){
        console.log(error)
    }
})



// Endpoint to add comments to a post
router.post('/addcomment/:postId', fetchUser, async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.postId;
        const { commentText } = req.body;

        const post = await Post.findById(postId);
        const user = await User.findById(userId)
        const name = `${user.FirstName} ${user.LastName}`

        if (!post) {
            return res.status(404).send('Post not found');
        }

        const newComment = {
            user: userId,
            username: name,
            commentText
        };

        post.comments.push(newComment); // Add the new comment to the post

        await post.save(); // Save the updated post

        res.status(200).json({post});
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/comments/:postId',async(req,res) =>{
    try{

        const postId = req.params.postId;
        const post = await Post.findById(postId);
        
        
       res.status(200).json(post.comments)

    }catch(error){


        res.status(500).send('Internal Server Error');
    }
})




module.exports = router;