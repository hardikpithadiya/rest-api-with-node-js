const express = require("express");
const feedController = require("../controllers/feed.controller");

const router = express.Router();

// GET -> /feed/posts
router.get("/posts", feedController.getPosts);
router.post("/posts", feedController.addPost);

module.exports = router;
