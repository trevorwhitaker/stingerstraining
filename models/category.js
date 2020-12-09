const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

module.exports = Category = mongoose.model("category", categorySchema);