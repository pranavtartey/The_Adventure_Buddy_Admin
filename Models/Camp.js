const mongoose = require("mongoose");

const campSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Number, //date should be provided in the format of yy/mm/dd and to convert the date back to human readable form pass this date in miliseconds to the new Date(your milisecond date) and you will get it
    required: true,
  },

  venue: {
    type: String,
    required: true,
  },

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
  studentCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Camp", campSchema);
