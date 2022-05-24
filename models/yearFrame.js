const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const yearSchema = new Schema({
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

const Year = mongoose.model("Year", yearSchema);

module.exports = Year;
