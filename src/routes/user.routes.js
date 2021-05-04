const express = require("express");
const { requireSignin } = require("../controllers/auth");
const { getUsers, getUsersByUsername, updateUserProfile, updateUserProfilePicture,updateUserCoverPicture, addUserPublicity, removeUserPublicity  } = require("../controllers/user");
const router = express.Router();
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

router.get("/search/firstname",requireSignin,getUsers);
router.get("/search/username",requireSignin,getUsersByUsername);
router.post("/user/update",requireSignin,updateUserProfile);
router.post("/user/update",requireSignin,updateUserProfile);
router.post("/user/update/profilePicture",upload.array('profilePicture'),requireSignin,updateUserProfilePicture );
router.post("/user/update/coverPicture",upload.array('coverPicture'),requireSignin,updateUserCoverPicture );
router.post("/user/add/publicity",requireSignin,addUserPublicity);
router.post("/user/remove/publicity",requireSignin,removeUserPublicity);

module.exports = router;