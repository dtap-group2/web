const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
});
module.exports = mongoose.connection;
