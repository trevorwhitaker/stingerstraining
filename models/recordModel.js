const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true },
  drill: { type: mongoose.Schema.Types.ObjectId, required: true },
  records : [{
    date : Date,
    sets: Number,
    count : Number,
    description : String
     }]
});

module.exports = Record = mongoose.model("record", recordSchema);