require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("./db/connect");
const app = express();
const nodemailer = require("nodemailer");
const cors = require("cors");
const adminRoutes = require("./Routes/Admin");
const schoolRoutes = require("./Routes/School");
const path = require("path");
const cron = require("node-cron");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { removeStudents } = require("./utils/RemoveStudents");

const PORT = process.env.PORT || 8080;

//Session Config
const sessionConfig = {
  secret: "thisismysecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "Lax",
  },
};

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "SchoolAuthorization",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
};

//Middleware used
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
app.use(express.static(path.join("../", "build")));
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(sessionConfig));

//Database Config
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

//Routes Config
app.use("/the_adventure_buddy/admin", adminRoutes);
app.use("/the_adventure_buddy/public", schoolRoutes);


removeStudents();
cron.schedule("0 0 * * 0", removeStudents);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port http://192.168.2.124:${PORT}`);
});
