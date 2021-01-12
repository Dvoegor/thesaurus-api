const express = require("express");
const createError = require("http-errors");

const app = express();
const port = 3000;

const indexRoute = require("./routes/index");
const editRoute = require("./routes/edit");

app.use("/", indexRoute);
app.use("/", editRoute);

app.use(function (req, res, next) {
  next(res.status(404).send(createError(404, "Такая страница не существует")));
});

app.listen(port, () => {
  console.log(`thesaurus-api at PORT:${port}`);
});
