const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
 email:{
     type: String,
     unique: true,
     lowercase: true
    },
   name: String,
   password: String,
   picture: String,
   isSeller: { 
       type: Boolean,
       default: false
    },
 address:{
     addr1: String,
     addr2: String,
     city: String,
     state: String,
     country: String,
     postalCode: String
 },
 created: { type: Data, default: Date.now}
});

UserSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password'))
    return next();

    bcrypt.hash(user.password, null, null, function(err, hash){
      if(err)
      return next(err);

      user.password = hash;
      next();
    });
});

/* Comparing password mehtod */
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
};

