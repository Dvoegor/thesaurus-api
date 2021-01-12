const express = require("express");
const pool = require("../pool");
const authorization = require("../authorization");
const createError = require("http-errors");
const router = express.Router();

router.get("/:id", authorization, async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query(`SELECT * FROM crossWords WHERE id=${id}`);
  const data = rows[0]
  if (!data) {
    res.status(404).send(createError(404, "Такая запись не существует"));
  } else {
    res.send(data);
  }
});

module.exports = router;
