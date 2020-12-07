const router = require("express").Router();
const Drill = require("../models/drillModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

router.post("/create", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        if (!user || user.role != "admin")
        {
            return res
            .status(401)
            .json({ msg: "Not authorized." });
        }

        const { name, description, category } = req.body;

        if (!name || !description || !category) {
            return res.status(400).json({msg: "Missing fields"});
        }

        const existingDrill = await Drill.findOne({name: name});
        if (existingDrill) {
            return res.status(400).json({msg: "Drill already exists"});
        }

        const newDrill = new Drill({
            name,
            description,
            category
        });

        const savedDrill = await newDrill.save();

        res.json(savedDrill);
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
        const user = await User.findById(req.user);

        if (!user || user.role != "admin")
        {
            return res
            .status(401)
            .json({ msg: "Not authorized." });
        }
      const deletedDrill = await Drill.findByIdAndDelete(req.drillId);
      res.json(deletedDrill);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;