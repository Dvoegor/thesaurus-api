const createError = require("http-errors");

const authorization = function (req, res, next) {
  if (req.session.success) {
    next();
  } else {
    res.status(403).send(createError(403, "Доступ запрещен!"));
  }
};

module.exports = authorization;
