exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        title: "First post",
        desc: "Hello World !",
      },
    ],
  });
};

exports.addPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    posts: [
      {
        postAddedOn: Date.now(),
        title: title,
        desc: content,
      },
    ],
  });
};
