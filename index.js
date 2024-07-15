require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("./db/connect");
const app = express();
const cors = require("cors");
const adminRoutes = require("./Routes/Admin");
const schoolRoutes = require("./Routes/School");
const path = require("path");

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("../", "build")));

app.use("/the_adventure_buddy/admin", adminRoutes);
app.use("/the_adventure_buddy/public", schoolRoutes);

const dbURL = process.env.dbURL;

const connectDb = async () => {
  await connect(dbURL);
};

connectDb();
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected Successfully");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
