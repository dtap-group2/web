const express = require("express");
const router = express.Router();

router.get("/day", (req, res) => {
  res.json([
    {
      time: "2013-07-03",
      data: 12,
    },
    {
      time: "2013-07-03",
      data: 32,
    },
    {
      time: "2013-07-03",
      data: 10,
    },
    {
      time: "2013-07-03",
      data: 26,
    },
  ]);
});

module.exports = router;
