const express = require("express");
const router = express.Router();
const Frame = require("../models/frame");
const Hour = require("../models/hourFrame");
const Day = require("../models/dayFrame");
const Week = require("../models/weekFrame");
const Month = require("../models/monthFrame");
const Year = require("../models/yearFrame");
const Summary = require("../models/summary");
const multer = require("multer");
const path = require("path");
const cleardir = require("../utils/cleardir");
const { rmSync } = require("fs");
const dayjs = require("dayjs");

//multer options
const upload = multer({
  dest: "frames",
});

const preframeupload = (req, res, next) => {
  const destination = path.join(__dirname, "../frames");
  cleardir(destination).then(next());
};

// * Initialize a tracker
router.post("/init", (req, res) => {
  //Req
  // {
  //   ID: 123
  // }

  //Check if tracker already in database
  //Add tracker if not
  res.status(200).send({
    trackerID: req.body.ID,
    added: true,
    registerDate: Date.now(),
  });
});

// * Updates database with data from tracker
router.post("/update-data", async (req, res) => {
  //Req
  // {
  //   totalVisitors: 3000,
  //   startTime: new Date.now(),
  //   endTime: new Date.now(),
  //   perLocation: [
  //     {
  //       locationID: 0,
  //       locationName: "Chinese Vase",
  //       totalVisitors: 1000,
  //     },
  //     {
  //       locationID: 0,
  //       locationName: "Literally Mona Lisa",
  //       totalVisitors: 2,
  //     },
  //   ],
  // }
  //Update database
  console.log(req.body);

  try {
    const newFrame = req.body;
    const frameCount = await Frame.estimatedDocumentCount();

    if (frameCount) {
      const oldFrame = await Frame.findOneAndReplace(
        { totalCount: { $gte: 0 } },
        newFrame,
        { returnDocument: "before" }
      ).exec();

      if (newFrame.totalCount > oldFrame.totalCount) {
        const additionalVisitor = newFrame.totalCount - oldFrame.totalCount;
        await updateHour(additionalVisitor, newFrame.timestamp);
      }

      res.status(200).send(newFrame);
    } else {
      const newFrame = await Frame.create(req.body);
      await updateHour(newFrame.totalCount, newFrame.timestamp);
      res.status(200).send(newFrame);
    }
  } catch (error) {
    console.error(newFrame, error);
    res.status(500).send(error);
  }
});

const updateHour = async (incrementValue, timestamp) => {
  try {
    await Hour.findOneAndUpdate(
      {
        startTime: { $lte: timestamp },
        endTime: { $gte: timestamp },
      },
      {
        $inc: { totalCount: incrementValue },
        $setOnInsert: {
          startTime: dayjs(timestamp, "X").startOf("hour").unix(),
          endTime: dayjs(timestamp, "X").endOf("hour").unix(),
        },
      },
      { upsert: true }
    ).exec();
  } catch (error) {
    console.error(error);
  }
};

const updateWeek = async (incrementValue) => {};

const updateMonth = async (incrementValue) => {};

const updateYear = async (incrementValue) => {};

router.post("/testjson", (req, res) => {
  if (Math.random() < 0.9) {
    console.log(req.body);
    res.send("Success");
  } else {
    console.log("hello");
    res.status(400).send("Fail");
  }
});

router.post(
  "/frame",
  preframeupload,
  upload.single("upload"),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;
