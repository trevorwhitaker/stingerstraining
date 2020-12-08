const router = require("express").Router();
const Drill = require("../models/drillModel");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const path = require('path');

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

        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({msg: 'No files were uploaded.'});
        }

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

        let video = req.files.video;
        await video.mv(process.env.VIDEOS_PATH + "/" + savedDrill._id + path.extname(video.name));

        res.json(savedDrill);
    }
    catch (error) {
        res.status(500).json({err: error.message});
    }
});

router.get("/:name", async (req, res) => {
    try {
      const drill = await Drill.findOne({ name: req.params.name });
      if (!drill)
        return res
          .status(400)
          .json({ msg: "No drill with that name." });

      res.json(drill);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get("/category/:category", async (req, res) => {
  try {
    console.log(req.params.category);
    const drills = await Drill.find({ category: req.params.category });

    res.json(drills);
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