const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  schools: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
