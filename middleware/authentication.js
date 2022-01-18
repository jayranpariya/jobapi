const { UnauthenticatedError } = require("../errors/index");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  //check header

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authorization invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authorization invalid");
  }
};

module.exports = auth;
