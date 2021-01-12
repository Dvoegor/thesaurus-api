const express = require("express");
const pool = require("../pool");
const authorization = require("../authorization");
const logs = require("../logs");
const createError = require("http-errors");
const router = express.Router();

router.get("/:id", authorization, async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query(`SELECT * FROM crossWords WHERE id=${id}`);
  const data = rows[0];
  if (!data) {
    res.status(404).send(createError(404, "Такая запись не существует"));
  } else {
    res.send(data);
  }
});

router.post("/:id", authorization, async (req, res) => {
  const id = req.params.id;
  const question = req.body.question ? `question = '${req.body.question}'` : 0;
  const answer = req.body.answer ? `answer = '${req.body.answer}'` : 0;
  const func = req.body.func ? `function = '${req.body.func}'` : 0;
  const method = req.body.method ? `method = '${req.body.method}'` : 0;
  const subjectArea = req.body.subjectArea
    ? `subjectArea = '${req.body.subjectArea}'`
    : 0;
  let attributeQuery = "SET ";
  const attributeArr = [question, answer, func, method, subjectArea];
  attributeArr.map(function (item) {
    if (item) {
      attributeQuery = attributeQuery + item + ", ";
    }
  });
  attributeQuery = attributeQuery.slice(0, attributeQuery.length - 2);

  const [rows] = await pool.query(
    `UPDATE crossWords ${attributeQuery} WHERE id=${id}`
  );

  if (!rows.affectedRows) {
    res.status(500).send(createError(500, "Ошибка редактирования записи"));
  } else {
    logs(1, req);
    res.status(200).send({ message: "Запись обновлена" });
  }
});

module.exports = router;
