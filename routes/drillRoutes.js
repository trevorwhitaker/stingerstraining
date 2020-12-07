const router = require("express").Router();
const Drill = require("../models/drillModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth").adminAuth;
const jwt = require("jsonwebtoken");

router.post("/create", auth, async (req, res) => {
    try {
        const { name, description, category } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({msg: "Missing fields"});
        }

        const existingDrill = await Drill.findOne({name: name});
        if (existingUser) {
            return res.status(400).json({msg: "Drill already exists"});
        }

        const newDrill = new Drill({
            name,
            description,
            category
        });

        const newDrill = await newUser.save();

        res.json(newDrill);
    }
    catch (error) {
        res.status(500).json({err: error.message});
    }
});

router.get("/", async (req, res) => {
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


module.exports = router;