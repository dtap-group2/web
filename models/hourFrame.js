const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hourSchema = new Schema({
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

const Hour = mongoose.model("Hour", hourSchema);

module.exports = Hour;
