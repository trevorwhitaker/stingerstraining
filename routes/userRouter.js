const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.get("/test", (req, res) => {
    res.send("Hello World lol");
});

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

        const newUser = new User({
            username,
            password: passwordHash,
            role: "User"
        });

        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
        res.json({
          token,
          user: {
            id: savedUser._id,
            username: savedUser.username,
          },
        });
        res.json(savedUser);
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
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
        },
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

router.post("/isTokenValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
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

module.exports = router;