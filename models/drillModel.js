const mongoose = require("mongoose");

const drillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  categories: [{
    type: String
  }]
});

module.exports = Drill = mongoose.model("drill", drillSchema);