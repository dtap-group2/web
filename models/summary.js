const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const summarySchema = new Schema({
  eventCount: {
    type: Number,
    required: true,
  },
  todayCount: {
    type: Number,
    required: true,
  },
  yesterdayCount: {
    type: Number,
    required: true,
  },
  hourCount: {
    type: Number,
    required: true,
  },
  eventDuration: {
    type: Number,
    required: true,
  },
});

const Summary = mongoose.model("Summary", summarySchema);

module.exports = Summary;
