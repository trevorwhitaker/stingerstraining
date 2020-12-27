const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    try {
        const { username, password, passwordCheck } = req.body;

        if (!username || !password || !passwordCheck) {
            return res.status(400).json({msg: "Missing fields"});
        }

        if (password.length < 5) {
            return res.status(400).json({msg: "Password needs to be of length 5"});
        }

        if (password != passwordCheck) {
            return res.status(400).json({msg: "Passwords do not match"});
        }

        const existingUser = await User.findOne({username: username});
        if (existingUser) {
            return res.status(400).json({msg: "Username already exists"});
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await(bcrypt.hash(password, salt));
        const d = new Date();
        const newUser = new User({
            username,
            password: passwordHash,
            role: "User",
            loginDates: [d.toDateString()]
        });

        const savedUser = await newUser.save();
        req.session.userId = savedUser._id;
        res.json({
          userId: savedUser._id
        });
    }
    catch (error) {
        res.status(500).json({err: error.message});
    }
});

router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // validate
      if (!username || !password)
        return res.status(400).json({ msg: "Not all fields have been entered." });
  
      const user = await User.findOne({ username: username });
      if (!user)
        return res
          .status(400)
          .json({ msg: "Invalid credentials." });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
      const d = new Date();
      user.loginDates.push(d.toDateString());
      await user.save();
      req.session.userId = user._id;
      res.json({
        userId: user._id
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.delete("/delete", auth, async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user);
      res.json(deletedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post("/isLoggedIn", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.json(false);
      }
  
      res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post("/logout", async (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({msg: "Error deleting session"});
    }
  });

  res.clearCookie('connect.sid');
  res.json({success: true});
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);

    if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
    }
    res.json({
      username: user.username,
      id: user._id,
    });
});

router.get("/isAdmin", auth, async (req, res) => {
  try {
      const user = await User.findById(req.user);

      if (!user || user.role != "admin")
      {
          res.json(false)
      }
      else {
        res.json(true)
      }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;