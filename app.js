const express = require("express");
const path = require("path");
const feedRoutes = require("./routes/feed.route");
const authRoutes = require("./routes/auth.route");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "/images")));

// Handle CORS
app.use((req, res, next) => {
  //For Domains
  res.setHeader("Access-Control-Allow-Origin", "*");

  //For Mmethods
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");

  //For Headers
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

//Route initialize
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

//Error Handling
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.statusCode || 500).json(error.message);
});

const connectionString =
  "mongodb+srv://hardikpithadiya:Kssm37!2@cluster0.v11xh.mongodb.net/rest-demo?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(connectionString)
  .then((result) => {
    const server = app.listen(8080);
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
