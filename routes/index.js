const express = require("express");
const pool = require("../pool");
const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : 1;
  const limit = 50;
  const startIndex = (page - 1) * limit;

  const question = req.query.question
    ? `question LIKE '%${req.query.question}%'`
    : 0;
  const answer = req.query.answer ? `answer LIKE '%${req.query.answer}%'` : 0;
  const func = req.query.func ? `function LIKE '${req.query.func}'` : 0;
  const method = req.query.method ? `method LIKE '${req.query.method}'` : 0;
  const subjectArea = req.query.subjectArea
    ? `subjectArea LIKE '${req.query.subjectArea}'`
    : 0;
  let attributeQuery = "WHERE ";
  const attributeArr = [question, answer, func, method, subjectArea];
  attributeArr.map(function (item) {
    if (item) {
      attributeQuery = attributeQuery + item + " AND ";
    }
  });
  attributeQuery = attributeQuery.slice(0, attributeQuery.length - 5);

  let sortBy;
  const order = "ORDER BY ";
  switch (req.query.sortBy) {
    case "question":
      sortBy = order + "question";
      break;
    case "answer":
      sortBy = order + "answer";
      break;
    case "func":
      sortBy = order + "function";
      break;
    case "method":
      sortBy = order + "method";
      break;
    case "subjectArea":
      sortBy = order + "subjectArea";
      break;
    default:
      sortBy = "";
  }

  const methods = ([rows] = await pool.query(
    `SELECT DISTINCT method FROM crossWords ORDER BY method`
  ));
  const dataMethods = methods[0].map((item) => item.method);

  const subjectAreas = ([rows] = await pool.query(
    `SELECT DISTINCT subjectArea FROM crossWords ORDER BY subjectArea`
  ));
  const dataSubjectAreas = subjectAreas[0].map((item) => item.subjectArea);

  const count = ([rows] = await pool.query(`SELECT COUNT(*) FROM crossWords`));
  const dataCount = count[0][0]["COUNT(*)"];

  const records = ([rows] = await pool.query(
    `SELECT * FROM crossWords ${attributeQuery} LIMIT ${startIndex}, ${limit} ${sortBy}`
  ));
  const dataRecords = records[0];

  const foundRecords = ([rows] = await pool.query(
    `SELECT COUNT(*) FROM crossWords ${attributeQuery}`
  ));
  const dbFoundRecords = foundRecords[0][0]["COUNT(*)"];

  if (!dataRecords) {
    res.status(404).send(createError(500, "Нет доступа к записям"));
  } else {
    res.send({
      dbSize: dataCount,
      dbFoundRecords: dbFoundRecords,
      methods: dataMethods,
      subjectAreas: dataSubjectAreas,
      records: dataRecords,
    });
  }
});

router.post("/logout", (req, res) => {
    req.session.success = false;
    res.status(200).redirect("/");
  });

module.exports = router;
