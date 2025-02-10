const express = require("express");
const feedRoutes = require("./routes/feed.route");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

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

app.listen(8080);
