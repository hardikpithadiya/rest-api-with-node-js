const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const feedController = require("../controllers/feed.controller");
const isAuth = require("../middleware/is-auth");

// GET -> /feed/posts
router.get("/posts", isAuth, feedController.getPosts);

//
router.get("/post/:postId", isAuth, feedController.getSinglePost);

// POST -> /feed/posts
router.post(
  "/posts",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.addPost
);

router.put(
  "/posts/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/posts/:postId", isAuth, feedController.deletePost);

module.exports = router;
