const express = require("express");
const router = express.Router();
const Summary = require("../models/summary");

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

  console.log("\nGet data with the following parameters: \n");
  console.log(req.query);

  //Fetch data from database according to the parameters and send
  const summary = await Summary.findOne().exec();
  res.status(200).send(summary);
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

module.exports = router;
