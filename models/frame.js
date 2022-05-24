const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const frameSchema = new Schema({
  timestamp: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
});

const Frame = mongoose.model("Frame", frameSchema);

module.exports = Frame;
