const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sudent",
    },
  ],
  studentCount: {
    type: Number,
  },
});

module.exports = mongoose.model("Camp", campSchema);
