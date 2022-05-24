const express = require("express");
const router = express.Router();
const graphRouter = require("./graph/graph");
const Hour = require("../models/hourFrame");
const Day = require("../models/dayFrame");
const Week = require("../models/weekFrame");
const Month = require("../models/monthFrame");
const Year = require("../models/yearFrame");
const Summary = require("../models/summary");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
var customParseFormat = require("dayjs/plugin/customParseFormat");
const { send } = require("process");
const generateRandom = require("../utils/random");
dayjs.extend(customParseFormat);

const dataDay = {
  total: 99,
  change: -10,
  data: {
    "0:00 AM": 0,
    "1:00 AM": 0,
    "2:00 AM": 0,
    "3:00 AM": 0,
    "4:00 AM": 0,
    "5:00 AM": 0,
    "6:00 AM": 0,
    "7:00 AM": 0,
    "8:00 AM": 3,
    "9:00 AM": 6,
    "10:00 AM": 7,
    "11:00 AM": 20,
    "12:00 AM": 10,
    "1:00 PM": 9,
    "2:00 PM": 9,
    "3:00 PM": 14,
    "4:00 PM": 12,
    "5:00 PM": 5,
    "6:00 PM": 3,
    "7:00 PM": 1,
    "8:00 PM": 0,
    "9:00 PM": 0,
    "10:00 PM": 0,
    "11:00 PM": 0,
  },
  hourlyAverage: 8,
};

const dataWeek = {
  total: 150,
  change: 30,
  data: {
    Monday: 12,
    Tuesday: 30,
    Wednesday: 25,
    Thursday: 50,
    Friday: 30,
    Saturday: 3,
    Sunday: 0,
  },
  dailyAverage: 25,
};

const dataYear = {
  total: 1410,
  change: -120,
  data: {
    January: 140,
    February: 200,
    March: 210,
    April: 190,
    May: 100,
    June: 50,
    July: 40,
    August: 30,
    September: 130,
    October: 140,
    November: 100,
    December: 80,
  },
  dailyAverage: 10,
  weeklyAverage: 39,
  monthlyAverage: 100,
};

router.use("/graph", graphRouter);

//* Initialize client webrouter
router.post("/init", (req, res) => {
  //Req
  // {
  //   ID" 321
  // }

  // Check if router already in database
  //Add router if not
  res.status(200).send({
    routerID: req.body.ID,
    added: true,
    registerDate: Date.now(),
  });
});

// * Fetch data to client router
router.get("/get-data", async (req, res) => {
  //Req
  //  - startTime
  //  - endTime
  //  - locationIDs
  const mode = req.query.mode;
  const startTime = dayjs(Number(req.query.startTime), "X");
  const endTime = dayjs(Number(req.query.endTime), "X");

  console.log("\nGet data with the following parameters: \n");
  console.log(mode, startTime, endTime);

  //Fetch data from database according to the parameters and send
  // const summary = await Summary.findOne().exec();
  // res.status(200).send(summary);
  switch (mode) {
    case "day":
      let toBeSend = dataDay;
      if (!startTime.startOf("day").diff(dayjs().startOf("day"))) {
        const hours = await Hour.find({
          startTime: { $gte: startTime.unix() },
          endTime: { $lte: endTime.unix() },
        });
        if (hours.length === 0) {
          res.status(200).send(dataDay);
          return;
        }
        const lastDay = await Hour.findOne({
          startTime: {
            $eq: startTime.subtract(1, "day").startOf("day").unix(),
          },
        });
        const total = hours.map((a) => a.totalCount).reduce((a, b) => a + b);
        const average = Math.round(
          total / hours.filter((a) => a.totalCount > 0).length
        );
        const change = lastDay !== null ? total - lastDay.totalCount : 0;
        const data = {};
        hours.forEach((a) => {
          data[dayjs(a.startTime, "X").format("hh:mm A")] = a.totalCount;
        });

        toBeSend = {
          total: total,
          change: change,
          hourlyAverage: average,
          data: data,
        };
      }
      res.status(200).send(toBeSend);
      break;
    case "week":
      res.status(200).send(dataWeek);
      break;
    case "month":
      let currentDay = dayjs(startTime.unix(), "X");
      const data = {};
      while (currentDay.unix() < endTime.unix()) {
        data[currentDay.format("DD/MM")] = Math.round(generateRandom(30, 100));
        currentDay = currentDay.add(1, "day");
      }
      const total = Object.values(data).reduce((a, b) => a + b);
      const average = total / Object.values(data).length;
      const change = generateRandom(0, 50);
      res.status(200).send({
        total: total,
        change: change,
        hourlyAverage: average,
        data: data,
      });
      break;
    case "year":
      res.status(200).send(dataYear);
      break;
    case "custom":
      let currentDayCustom = dayjs(startTime.unix(), "X");
      const dataCustom = {};
      while (currentDayCustom.unix() < endTime.add(1, "day").unix()) {
        dataCustom[currentDayCustom.format("DD/MM")] = Math.round(
          generateRandom(0, 40)
        );
        currentDayCustom = currentDayCustom.add(1, "day");
      }
      const totalCustom = Object.values(dataCustom).reduce((a, b) => a + b);
      const averageCustom = totalCustom / Object.values(dataCustom).length;
      const changeCustom = generateRandom(0, 15);
      res.status(200).send({
        total: totalCustom,
        change: changeCustom,
        hourlyAverage: averageCustom,
        data: dataCustom,
      });
      break;
    default:
      res.status(400).send({});
      break;
  }
});

// * Edit tracker boundaries
router.post("/edit-boundaries", (req, res) => {
  //Req
  //Data type to be decided
  res.status(200).send("Boundaries Updated");
});

//* Get summary data
router.get("/summary-data", (req, res) => {
  res.status(200).send("Success");
});

//* Get report file
router.get("/report-file", (req, res) => {
  //Generate report and create upload link
  let link = "/reports/2022-28-03.pdf";
  res.status(200).send(link);
});

//* Start tracker
router.post("/start-tracker", (req, res) => {
  //Req
  //  - ID
  res.status(200).send("Started tracker #" + req.body.ID);
});

//* Stop tracker
router.post("/stop-tracker", (req, res) => {
  //Req
  //  - ID
  res.status(200).send("Stopped tracker #" + req.body.ID);
});

//* Get the latest frame from tracker
router.get("/frame", async (req, res) => {
  fs.readdir(path.join(__dirname, "../frames"), (err, files) => {
    if (err) {
      res.status(400).send("No frame available");
    } else {
      console.log(files);
      res.sendFile(path.join(__dirname, "../frames", files[0]));
    }
  });
});

module.exports = router;
