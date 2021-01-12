const express = require("express");
const pool = require("../pool");
const authorization = require("../authorization");
const createError = require("http-errors");
const router = express.Router();

router.get("/", authorization, async (req, res) => {
  res.status(200).send("Create");
});

router.post("/", authorization, async (req, res) => {
  const [
    rows,
  ] = await pool.query(`INSERT INTO crossWords (question,answer,function,method,subjectArea)
                VALUES (
                '${req.body.question}',
                '${req.body.answer}',
                '${req.body.function}',
                '${req.body.method}',
                '${req.body.subjectArea}')
                `);

  if (!rows.affectedRows) {
    res.status(500).send(createError(500, "Ошибка добавления записи"));
  } else {
    res.status(200).send({ message: "Запись добавлена" });
  }
});

module.exports = router;
