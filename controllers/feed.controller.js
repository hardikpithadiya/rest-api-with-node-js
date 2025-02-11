const { validationResult } = require("express-validator");
const Post = require("../models/post.model");
const fs = require("fs");
const path = require("path");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((result) => {
      res.status(200).json({
        posts: result,
      });
    })
    .catch((error) => {
      error.statusCode = 500;
      next(error);
    });
};

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.postId)
    .then((result) => {
      if (!result) {
        const error = new Error("Not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        post: result,
      });
    })
    .catch((error) => {
      next(error);
    });
};

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);
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
    creator: {
      name: "Hardik P",
    },
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  console.log("here");
  const errors = validationResult(req);
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

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Not found");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Product updated successfully...", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Not found");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findOneAndDelete(postId);
    })
    .then(() => {
      res.status(200).json({ message: "Product Deleted successfully..." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "../images", filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
