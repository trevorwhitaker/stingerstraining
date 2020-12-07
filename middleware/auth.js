const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization denied." });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    req.user = verified.id;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const adminAuth = (req, res, next) => {
    try {
      const token = req.header("x-auth-token");
      if (!token)
        return res
          .status(401)
          .json({ msg: "No authentication token, authorization denied." });
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified)
        return res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied." });
  
        
      const user = await User.findById(req.user);

      if (!user || user.role != "admin")
      {
        return res
        .status(401)
        .json({ msg: "Not authorized." });
      }
      req.user = verified.id;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

module.exports = {
   auth,
   adminAuth
}