const User = require("../models/users");
const jwt = require("jsonwebtoken");
const {validationResult}  = require('express-validator')
const bcrypt = require('bcrypt')

exports.signup =  (req, res) => {
 User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      return res.status(400).json({
        message: "Email Already Registered",
      });
    }
    let profilePicture = {
      img:""
    }
    
    if(req.files.length>0){
       profilePicture =   {
        img:req.files[0].filename
      }
    }
    const { firstName, lastName, email, password, username,contactNumber,dob,gender,bio } = req.body;
    const hash_password = await bcrypt.hash(password,10)
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username,
      contactNumber,
      profilePicture,
      dob,
      gender,
      bio
    });
    _user.save((error, data) => {
      if (error) {
          console.log(error);
        return res.status(400).json({
          message: "Signup Failed !",
        });
      }
      if (data) {
        return res.status(201).json({
          message: "User Created Successfully !",
        });
      }
    });
  });
};
exports.signupAuthentication =  (req, res) => {
    const {email,username,contactNumber} = req.body;
    if(email){
      User.findOne({email:email}).exec(async (error,data)=>{
        if(error){
          res.status(400).json({message:"Invalid email" ,error:error})
        }else if(data){
          res.status(200).json({message:"Email exist"})
        }else{
          res.status(200).json({message:"Valid email"})
        }
      })
    }else if(username){
      User.findOne({username:username}).exec(async (error,data)=>{
        if(error){
          res.status(400).json({message:"Invalid username" , error:error})
        }else if(data){
          res.status(200).json({message:"Username exist"})
        }else{
          res.status(200).json({message:"Valid username"})
        }
      })
    }else if(contactNumber){
      User.findOne({contactNumber:contactNumber}).exec(async (error,data)=>{
        if(error){
          res.status(400).json({message:"Invalid mobile number" , error:error})
        }else if(data){
          res.status(200).json({message:"mobile number exist"})
        }else{
          res.status(200).json({message:"Valid mobile number"})
        }
      })
    }
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (error) {
      return res.status(400).json({ error });
    }
    if (user) {
      const { _id, firstName, lastName, email, role, fullName , username,contactNumber,profilePicture,gender,bio,dob ,coverPicture , followers , following} = user;
      const passwordValidation = await user.authenticate(req.body.password);
      if (passwordValidation && user.role==="user") {
        const token = jwt.sign({ _id: user._id ,role:user.role}, process.env.SECRET_KEY, {
          expiresIn: "12h",
        });
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName ,username,contactNumber,profilePicture,gender,bio,dob,coverPicture , followers , following},
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    }else{
      return res.status(400).json({message:"User doesn't exist"})
    }
  });
};

exports.signout = (req,res,next)=>{
  res.clearCookie('token')
  res.status(200).send({message:"Signout Successfully"})
}

exports.requireSignin =(req,res,next)=>{
  const token = req.headers.authorization.split(" ")[1]
  const user = jwt.verify(token,process.env.SECRET_KEY)
  req.user = user
  
  next()
}
