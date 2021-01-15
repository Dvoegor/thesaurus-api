const createError = require("http-errors");

const authorization = function (req, res, next) {
  const cookie = !!req.cookies.success
  if (req.session.success || cookie) {
    next();
  } else {
    res.status(403).send(createError(403, "Доступ запрещен!"));
  }
};

module.exports = authorization;
