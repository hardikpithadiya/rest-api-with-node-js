const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const io = require("../socket");

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const pageSize = 10;
  try {
    const totalPosts = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      posts: posts,
      count: totalPosts,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  try {
    const result = await Post.findById(req.params.postId);
    if (!result) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      post: result,
    });
  } catch (error) {
    next(error);
  }
};

exports.addPost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (errors.errors && errors.errors.length > 0) {
      const error = new Error("Invalid data");
      error.statusCode = 422;
      throw error;
    }

    if (!req.file) {
      const error = new Error("No image provided..");
      error.statusCode = 422;
      throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.file.path.replace("\\", "/");

    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    //This will send data to cient
    io.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });
    res.status(200).json({
      message: "Post created",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (errors.errors && errors.errors.length > 0) {
      const error = new Error("Invalid data");
      error.statusCode = 422;
      throw error;
    }

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }

    if (!imageUrl) {
      const error = new Error("No image provided..");
      error.statusCode = 422;
      throw error;
    }

    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const result = await post.save();
    io.getIO().emit("posts", { action: "update", post: result });
    res
      .status(200)
      .json({ message: "Product updated successfully...", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error("Not found");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    clearImage(post.imageUrl);
    await Post.findOneAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit("posts", { action: "delete", post: postId });
    res.status(200).json({ message: "Post Deleted successfully..." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../images", filePath);
  filePath = filePath.replace("\\images", "");
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
