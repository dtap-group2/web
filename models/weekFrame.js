const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weekSchema = new Schema({
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

const Week = mongoose.model("Week", weekSchema);

module.exports = Week;
