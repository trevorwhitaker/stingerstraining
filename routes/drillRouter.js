const router = require("express").Router();
const Drill = require("../models/drillModel");
const Category = require("../models/category");
const Record = require("../models/recordModel");
const ffmpeg = require('fluent-ffmpeg');
const auth = require("../middleware/auth");
const path = require('path');
const constants = require('../util/constants');

router.post("/create", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);
        if (!user || user.role != "admin")
        {
            return res
            .status(401)
            .json({ msg: "Not authorized." });
        }

        const { name, description, categories } = req.body;

        if (!req.files || Object.keys(req.files).length === 0) {
          return res.status(400).json({msg: 'No files were uploaded.'});
        }

        if (!name || !description || !categories || categories.length == 0) {
            return res.status(400).json({msg: "Missing fields"});
        }

        const existingDrill = await Drill.findOne({name: name});
        if (existingDrill) {
            return res.status(400).json({msg: "Drill already exists"});
        }

        const categoriesArray = categories.split(',');

        // TODO: check that each selected category exists in DB first, else res error
        let exists = false;
        for (category of categoriesArray) {
          const testCategory = await Category.findOne({value: category});
          if (testCategory) {
            exists = true;
            break;
          }
        }

        if (!exists) {
          return res.status(400).json({msg: "Category doesn't exist"});
        }
        
        const newDrill = new Drill({
            name,
            description,
            categories: categoriesArray
        });

        const savedDrill = await newDrill.save();

        let video = req.files.video;
        const videoPath = constants.videoDir + "/" + savedDrill._id + path.extname(video.name);
        await video.mv(videoPath);

        ffmpeg(videoPath).screenshots({
          timestamps: ['50%'],
          filename: savedDrill._id + '.png',
          folder: constants.thumbnailDir,
          size: '320x240'
        });

        res.json(savedDrill);
    }
    catch (error) {
        res.status(500).json({err: error.message});
    }
});

router.get("/:name", auth, async (req, res) => {
    try {
      const drill = await Drill.findOne({ name: req.params.name });
      if (!drill)
        return res
          .status(400)
          .json({ msg: "No drill with that name." });
          const records = await Record.findOne({user: req.user, drill: drill._id});
      res.json({drill: drill, records: records});
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
  const drills = await Drill.find();
  res.json(drills);
})

router.get("/category/:category", auth, async (req, res) => {
  try {
    const drills = await Drill.find({ categories: req.params.category });
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

router.post("/createRecord", auth, async (req, res) => {
  try {
    const { drillId, count, type } = req.body;
    const user = await User.findById(req.user);
    if (!user)
    {
        return res
        .status(401)
        .json({ msg: "Not authorized." });
    }
    const userId = user._id;
    const existingRecord = await Record.findOne({user: userId, drill: drillId});

    let savedRecord = null;
    if (existingRecord) {

      existingRecord.records.push({
        date: new Date(),
        count: count,
        description: type
      });
      savedRecord = await existingRecord.save();
    }
    else {
      const newRecord = new Record({user: userId, drill: drillId, records: [{date: new Date(), count: count, description: type}]});
      savedRecord = await newRecord.save();
    }

    return res.json(savedRecord);

  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;