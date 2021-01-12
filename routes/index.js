const express = require("express");
const pool = require("../pool");
const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await pool.query(`SELECT * FROM crossWords`);
  res.send(rows);
});

module.exports = router;
