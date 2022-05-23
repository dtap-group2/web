const express = require("express");
const router = express.Router();
const Frame = require("../models/frame");
const Summary = require("../models/summary");
const multer = require("multer");
const path = require("path");
const cleardir = require("../utils/cleardir");
const { rmSync } = require("fs");

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
  const newFrame = req.body;
  const frameCount = await Frame.estimatedDocumentCount();

  if (frameCount) {
    try {
      const oldFrame = await Frame.findOneAndReplace(
        { totalCount: { $gte: 0 } },
        newFrame,
        { returnDocument: "before" }
      ).exec();

      if (newFrame.totalCount > oldFrame.totalCount) {
        const additionalVisitor = newFrame.totalCount - oldFrame.totalCount;
        updateSummary(additionalVisitor);
      }

      res.status(200).send(newFrame);
    } catch (error) {
      console.error(newFrame, error);
      res.status(500).send(error);
    }
  } else {
    try {
      const newFrame = await Frame.create(req.body);
      await updateSummary(newFrame.totalCount);
      res.status(200).send(newFrame);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
});

const updateSummary = async (incrementValue) => {
  const summaryCount = await Summary.estimatedDocumentCount();
  console.log(summaryCount);
  if (summaryCount) {
    Summary.findOneAndUpdate(
      { eventCount: { $gte: 0 } },
      { $inc: { eventCount: incrementValue } }
    ).exec();
  } else {
    Summary.create({
      eventCount: incrementValue,
      todayCount: incrementValue,
      yesterdayCount: incrementValue,
      hourCount: incrementValue,
      eventDuration: 1,
    });
  }
};

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
