const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = (req, res, next) => {
  try {
    req.user = req.session.userId;

    if (!req.user) {
      return res.status(500).json("Unauthorized");
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = auth;