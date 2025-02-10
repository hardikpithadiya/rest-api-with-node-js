const express = require("express");
const path = require("path");
const feedRoutes = require("./routes/feed.route");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
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
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
