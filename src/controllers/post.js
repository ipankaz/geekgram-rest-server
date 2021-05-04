const Post = require("../models/posts");
const User = require("../models/users");

exports.createPost = async (req, res, next) => {
  const { description } = req.body;

  let pictures = [];
  if (req.files.length > 0) {
    pictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const user = await User.findOne({ _id: req.user._id }).select(
    "_id firstName lastName email username contactNumber profilePicture coverPicture"
  );

  const _post = {
    user,
    description,
    pictures,
    createdBy: req.user._id,
  };

  const post = new Post(_post);

  post.save((error, posts) => {
    if (error) {
      res.status(400).json({ error });
    } else if (posts) {
      res.status(200).json({ posts });
    }
  });
};

exports.deletePostById = async (req, res, next) => {
  const { postId } = req.query;
  const post = await Post.findOne({ _id: postId }).select("_id user");

  if (postId && req.user._id == post.user._id) {
    const deletedPost = await Post.deleteOne({ _id: postId }).exec(
      (error, result) => {
        if (error) return res.status(400).json({ error });
        if (result) {
          res.status(202).json({ result });
        }
      }
    );
  } else {
    res.status(400).json({ error: "Params required or different user" });
  }
};

exports.updatePostById = async (req, res, next) => {
  const { postId } = req.query;
  const { updatePost } = req.body;
  // const post = await Post.findOne({_id:postId}).select("_id user")

  if (postId) {
    const updatedPost = await Post.updateOne({ _id: postId }, updatePost, {
      new: true,
    });
    res.status(201).json(updatedPost);
  } else {
    res.status(400).json({ error: "Params required or different user" });
  }
};
exports.editPostById = async (req, res, next) => {
  const { postId } = req.query;
  const { description } = req.body;

  let pictures = [];
  if (req.files && req.files.length > 0) {
    pictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  // const post = await Post.findOne({_id:postId})

  if (postId && description && req.files && req.files.length > 0) {
    const updatedPost = await Post.updateOne(
      { _id: postId },
      { description: description, pictures: pictures },
      { new: true }
    );
    res.status(201).json(updatedPost);
  } else if (postId && description) {
    const updatedPost = await Post.updateOne(
      { _id: postId },
      { description: description },
      { new: true }
    );
    res.status(201).json(updatedPost);
  } else if (postId && req.files && req.files.length > 0) {
    const updatedPost = await Post.updateOne(
      { _id: postId },
      { pictures: pictures },
      { new: true }
    );
    res.status(201).json(updatedPost);
  } else {
    res.status(400).json({ error: "Params required or different user" });
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    // .select("_id user description pictures createdBy likes comments createdAt")
    // .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ posts });
};

exports.getUserPosts = async (req, res) => {
  const {userId} = req.query
  console.log(userId);
  const posts = await Post.find({createdBy : userId})
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({ posts });
};
