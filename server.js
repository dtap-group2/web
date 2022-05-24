const express = require("express");
const cors = require("cors");
const db = require("./mongo");
const trackerRoutes = require("./routes/tracker");
const clientRoutes = require("./routes/client");

const app = express();

app.use(express.json());
app.use("/tracker", trackerRoutes);
app.use("/tracker", cors());
app.use("/client", clientRoutes);

app.use(express.static("client"));

db.on("error", console.error); //Comment out

// Comment ...
db.once("open", () => {
  console.log("Connected to database");
  app.listen(process.env.PORT || 3000);
});
//OUT
