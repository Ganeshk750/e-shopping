const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

/* Signup api */
router.post('/signup',(req,res, next) =>{
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = req.gravatar;
    user.isSeller = req.body.isSeller;

    User.findOne({ email: req.body.email},(err, existingUser) =>{
        if(existingUser){
            res.json({
                success: false,
                message: 'Account with that email is already exist'
            });
        }else{
            user.save();
            
            let token = jwt.sign({
                user: user
            }, config.secret,{
              expiresIn: '7d' 
            });
            
            res.json({
                success: true,
                message: 'token is here',
                token: token
            });
        }
    })
});

/* Login api */
router.post('/login',(req,res,next) =>{
    User.findOne({ email: req.body.email },(err,user) =>{
        if(err) throw err;
        if(!user){
            res.json({
                success: false,
                message:'Authentication failed User not found'
            });
        }else if(user){
            let validPassword = user.comparePassword(req.body.password);
            if(!validPassword){
                res.json({
                    success: false,
                    message:'Authentication failed User enter worng password'
                });
            }else{
                let token = jwt.sign({
                    user: user
                }, config.secret,{
                  expiresIn: '7d' 
                });

                res.json({
                    success: true,
                    message: 'token is here',
                    token: token
                });
            }
        }
    });
});
module.exports = router;