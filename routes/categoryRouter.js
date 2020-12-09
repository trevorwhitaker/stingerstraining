const router = require("express").Router();
const Category = require("../models/category");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const path = require('path');

router.post("/create", auth, async (req, res) => {
    try {
        const { label, value, description } = req.body;
        const existingCategory = await Category.findOne({label: label});
        if (existingDrill) {
            return res.status(400).json({msg: "Category already exists"});
        }

        const newCategory = new Category({
            label,
            value,
            description
        });

        const savedCategory = await newCategory.save();

        res.json(savedCategory);
    }
    catch (error) {
        res.status(500).json({err: error.message});
    }
});

router.get("/", auth, async (req, res) => {
    try {
      const categories = await Category.find();

      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;