const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First post",
        desc: "Hello World !",
        imageUrl: "images/ROK.jpg",
        creator: {
          name: "Hardik",
        },
        createdAt: new Date(),
      },
    ],
  });
};

exports.addPost = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.errors) {
    return res.status(422).json({
      message: "Invalid data",
      errors: errors.errors,
    });
  }

  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    post: {
      _id: Date.now().toLocaleString(),
      title: title,
      desc: content,
      creator: {
        name: "Hardik",
      },
      createdAt: new Date(),
    },
  });
};
