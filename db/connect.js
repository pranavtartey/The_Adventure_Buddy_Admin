const mongoose = require("mongoose");

const connectDB = (dbURL) => {
  return mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
