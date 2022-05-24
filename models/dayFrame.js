const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const daySchema = new Schema({
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

const Day = mongoose.model("Day", daySchema);

module.exports = Day;
