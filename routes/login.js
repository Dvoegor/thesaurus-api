const express = require("express");
const createError = require("http-errors");
const pool = require("../pool");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session.success) {
    res.status(200).redirect("/");
  }
  res.status(200).send("Login");
});

router.post("/", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const [rows] = await pool.query(
    `SELECT * FROM profiles WHERE email='${email}' AND password='${password}'`
  );
  if (rows.length) {
    req.session.success = true;
    req.session.email = rows[0].email;
    res.status(200).send({ success: req.session.success, email: req.session.email })
  } else {
    req.session.success = false;
    res.status(200).send(req.session.success);
  }
});

module.exports = router;