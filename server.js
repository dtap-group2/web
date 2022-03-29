const express = require("express");

const app = express();

app.use(express.json());

let testData = {
  totalVisitors: 3000,
  startTime: Date.now(),
  endTime: Date.now(),
  perLocation: [
    {
      locationID: 0,
      locationName: "Chinese Vase",
      totalVisitors: 1000,
    },
    {
      locationID: 0,
      locationName: "Literally Mona Lisa",
      totalVisitors: 2,
    },
  ],
  perTimePeriod: [
    {
      startTime: Date.now(),
      endTime: Date.now(),
      totalVisitors: 200,
    },
    {
      startTime: Date.now(),
      endTime: Date.now(),
      totalVisitors: 300,
    },
  ],
};

// * Initialize a tracker
app.post("/init-tracker", (req, res) => {
  //Req
  // {
  //   ID: 123
  // }

  //Check if tracker already in database
  //Add tracker if not
  res.status(500).send({
    trackerID: req.body.ID,
    added: true,
    registerDate: Date.now(),
  });
});

// * Initialize a client app
app.post("/init-app", (req, res) => {
  //Req
  // {
  //   ID" 321
  // }

  // Check if app already in database
  //Add app if not
  res.status(500).send({
    appID: req.body.ID,
    added: true,
    registerDate: Date.now(),
  });
});

// * Updates database with data from tracker
app.post("/update-data", (req, res) => {
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
  console.log("\nUpdate data with: \n");
  console.log(req.body);
  res.status(500).send("Database Updated");
});

// * Fetch data to client app
app.get("/get-data", (req, res) => {
  //Req
  //  - startTime
  //  - endTime
  //  - locationIDs

  console.log("\nGet data with the following parameters: \n");
  console.log(req.query);

  //Fetch data from database according to the parameters and send
  res.status(500).send(testData);
});

// * Edit tracker boundaries
app.post("/edit-boundaries", (req, res) => {
  //Req
  //Data type to be decided
  res.status(500).send("Boundaries Updated");
});

//* Get summary data
app.get("/summary-data", (req, res) => {
  res.status(500).send(testData);
});

//* Get report file
app.get("/report-file", (req, res) => {
  //Generate report and create upload link
  let link = "/reports/2022-28-03.pdf";
  res.status(500).send(link);
});

//* Start tracker
app.post("/start-tracker", (req, res) => {
  //Req
  //  - ID
  res.status(500).send("Started tracker #" + req.body.ID);
});

//* Stop tracker
app.post("/stop-tracker", (req, res) => {
  //Req
  //  - ID
  res.status(500).send("Stopped tracker #" + req.body.ID);
});

app.listen(3000);
