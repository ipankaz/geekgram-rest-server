const User = require("../models/users");

exports.getUsers = async (req, res) => {
  const { firstname } = req.query;
  // 'i' is used for ignoring case sensitive
  // /name/ this is the regex . if name appears between the firstname , respnse will give results then
  const users = await User.find({ firstName: { $regex: firstname, $options: "i" } })
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({ users });
};

exports.getUsersByUsername = async (req, res) => {
  const { username } = req.query;
  // 'i' is used for ignoring case sensitive
  // /username/ this is the regex . if username appears between the username , respnse will give results then
  const users = await User.find({
    username: { $regex: username, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({ users });
};

exports.updateUserProfile = async (req, res) => {
  const { userId } = req.query;
  const { updateUser } = req.body;

  if (userId) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          firstName: updateUser.firstName,
          lastName: updateUser.lastName,
          username: updateUser.username,
          bio: updateUser.bio,
          contactNumber: updateUser.contactNumber,
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber coverPicture profilePicture gender bio dob"
    );
    res.status(201).json({ updatedUser });
  } else {
    res.status(400).json({ error: "params required" });
  }
};

exports.updateUserProfilePicture = async (req, res) => {
  const { userId } = req.query;
  let profilePicture = {
    img: "",
  };
  if (req.files && req.files.length > 0) {
    profilePicture.img = req.files[0].filename;
  }

  if (userId && profilePicture.img !== "") {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          profilePicture: profilePicture,
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber coverPicture profilePicture gender bio dob"
    );
    res.status(201).json({ updatedUser });
  } else {
    res.status(400).json({ error: "params required" });
  }
};

exports.updateUserCoverPicture = async (req, res) => {
  const { userId } = req.query;
  let coverPicture = {
    img: "",
  };
  if (req.files && req.files.length > 0) {
    coverPicture.img = req.files[0].filename;
  }

  if (userId && coverPicture.img !== "") {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          coverPicture: coverPicture,
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber profilePicture coverPicture gender bio dob"
    );
    res.status(201).json({ updatedUser });
  } else {
    res.status(400).json({ error: "params required" });
  }
};

exports.addUserPublicity = async (req, res) => {
  const { friendUserId } = req.query;
  const { userId } = req.body;

  if (userId && friendUserId) {
    const friendUser = await User.findOne({_id:friendUserId}).select("_id firstName lastName fullName username profilePicture")
    const updatedUser = await User.findOneAndUpdate(
      // 'following.userId': {$ne: friendUserId} ==> it will create a unique property for userId in "following" Array of Objects
      // as objects in array can't have a default unique property. This is the simplest method from server side.
      { _id: userId ,'following.userId': {$ne: friendUserId}},
      {
        $addToSet: {
          following: {userId : friendUserId,user:friendUser},
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber profilePicture coverPicture gender bio dob followers following"
    );

    const user = await User.findOne({_id:userId}).select("_id firstName lastName fullName username profilePicture")
    const updatedFriendUser = await User.findOneAndUpdate(
      // 'followers.userId': {$ne: userId} ==> it will create a unique property for userId in "followers" Array of Objects
      // as objects in array can't have a default unique property. This is the simplest method from server side.
      { _id: friendUserId,'followers.userId': {$ne: userId} },
      {
        $addToSet: {
          followers: {userId : userId,user:user},
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber profilePicture coverPicture gender bio dob followers following"
    );
    res.status(201).json({ updatedUser,updatedFriendUser });
  } else {
    res.status(400).json({ error: "params required" });
  }
};

exports.removeUserPublicity = async (req, res) => {
  const { friendUserId } = req.query;
  const { userId } = req.body;

  if (userId && friendUserId) {

    const friendUser = await User.findOne({_id:friendUserId}).select("_id firstName lastName fullName username profilePicture")
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          following: {userId : friendUserId},
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber profilePicture coverPicture gender bio dob followers following"
    );

    const user = await User.findOne({_id:userId}).select("_id firstName lastName fullName username profilePicture")
    const updatedFriendUser = await User.findOneAndUpdate(
      { _id: friendUserId },
      {
        $pull: {
          followers: {userId : userId},
        },
      },
      {
        new: true,
      }
    ).select(
      "_id firstName lastName username email role fullName contactNumber profilePicture coverPicture gender bio dob followers following"
    );
    res.status(201).json({ updatedUser,updatedFriendUser });
  } else {
    res.status(400).json({ error: "params required" });
  }
};
