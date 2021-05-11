const express = require("express");
const { signup, signin, signout, signupAuthentication} = require("../controllers/auth");
const router = express.Router();
const {validateSignupRequest,validateSigninRequest,isRequestValidated} = require('../Validators/auth')
const multer = require('multer')
const shortId = require('shortid')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname),'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortId.generate() + '-' + file.originalname )
    }
  })
   
  const upload = multer({ storage: storage })
router.post("/signup/authentication",signupAuthentication);
router.post("/signup",upload.array('profilePicture'), validateSignupRequest,isRequestValidated,signup);
router.post("/signin",validateSigninRequest,isRequestValidated, signin);
router.post("/signout", signout);


module.exports = router;