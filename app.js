const express = require("express");
const feedRoutes = require("./routes/feed.route");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

//Route initialize
app.use("/feed", feedRoutes);

app.listen(8080);
