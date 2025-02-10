const { validationResult } = require("express-validator");
const Post = require("../models/post.model");

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

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.body.imageUrl;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: "Hardik",
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
