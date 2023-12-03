const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../Schemas/User.js');
const fetchUser = require('../Middleware/FetchUser.js');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.post('/signup', async (req, res) => { //signup endpoint
    try {
        const { FirstName, LastName, Email, Password, DOB } = req.body;

        const existingUser = await User.findOne({ Email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = new User({
            FirstName,
            LastName,
            Email,
            DOB,
            Password: hashedPassword
        });

        const savedUser = await newUser.save();
        const data = {
            id: savedUser._id
        };

        const token = jwt.sign(data, process.env.SECRET);
        res.json({ token });
    } catch (error) {
        console.log(req.body);
        res.status(400).send(error);
    }
});


router.post('/login', async (req, res) => { //login endpoint
    try {

        const searchUser = await User.findOne({ Email: req.body.Email })
        if (!searchUser) {
            res.status(400).send("Wrong Credentials")
        }

        else if (searchUser) {

            try {

                const result = await bcrypt.compare(req.body.Password, searchUser.Password)
                const data = {
                    id: searchUser._id
                }

                if (result) {
                    
                    const token = jwt.sign(data, process.env.SECRET)
                    res.json({token})
                }
                else {
                    res.status(401).json({ error: "Wrong Password" }); // Return a JSON error object
                }

            } catch (error) {
                console.log(error)
            }

        }



    } catch (error) {
        console.log(req.body)
        res.status(400).send(error); // Send back any error occurred during saving
    }
})

router.get('/user', fetchUser, async(req,res) =>{

    try{

        const userId = req.id

        const user = await User.findById(userId)
        res.status(200).json({user})

    }catch(error){
        res.status(400).json({error})
    }

  

})



module.exports = router;
