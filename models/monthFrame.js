const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const monthSchema = new Schema({
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
});

const Month = mongoose.model("Month", monthSchema);

module.exports = Month;
