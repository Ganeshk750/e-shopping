const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkJWT = require('../middlewares/check-jwt');
const User = require('../models/user');
const config = require('../config');

/* Signup api */
router.post('/signup',(req,res, next) =>{
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.picture = user.gravatar();
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
                    message: 'This is youe token',
                    token: token
                });
            }
        }
    });
});

/* Profile get and post api */
router.route('/profile')
      .get(checkJWT,(req,res,next) =>{
          User.findOne({_id: req.decoded.user._id}, (err,user) =>{
              res.json({
                  success: true,
                  user: user,
                  message: "Successful"
              });
          });
      })
      .post(checkJWT,(req,res, next) =>{
          User.findOne({_id:req.decoded.user._id}, (err,user) =>{
              if(err) return next(err);
              if(req.body.name) user.name = req.body.name;
              if(req.body.email) user.email = req.body.email;
              if(req.body.password) user.password = req.body.password;

              user.isSeller = req.body.isSeller;
              user.save();
              res.json({
                  success: true,
                  message: 'Successfully edited your profile'
              });
          });
      });

/* Address Api GET and POST */
router.route('/address')
      .get(checkJWT,(req,res,next) =>{
          User.findOne({_id: req.decoded.user._id},(err,user) =>{
              res.json({
                  success: true,
                  address: user.address,
                  message: 'Successfull'
              });
          });
      })
      .post(checkJWT,(req,res,next) =>{
          User.findOne({_id: req.decoded.user._id},(err,user) =>{
              if(err) return next(err);
              
              if(req.body.addr1) user.address.addr1 = req.body.addr1;
              if(req.body.addr2) user.address.addr2 = req.body.addr2;
              if(req.body.city) user.address.city = req.body.city;
              if(req.body.state) user.address.state = req.body.state;
              if(req.body.country) user.address.country = req.body.country;
              if(req.body.postalCode) user.address.postalCode = req.body.postalCode;

              user.save();
              res.json({
                  success: true,
                  message: 'Successfully added address'
              });
          });
      });
module.exports = router;