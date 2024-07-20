const School = require("../Models/School");
const Camp = require("../Models/Camp");
const Admin = require("../Models/Admin");
const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.getAllSchoolList = async (req, res) => {
  // const schoolsList = await School.find({})
  //   .populate("students")
  //   .populate("camps");
  const schoolsList = await School.find({})
    .populate({
      path: "camps",
      populate: {
        path: "students",
      },
    })
    .exec();
  //getting all the schools (full schools document)
  res.status(201).json(schoolsList);
};

module.exports.registerAdmin = async (req, res) => {
  let { username, password } = req.body;
  const usernameAlreadyPresent = await Admin.findOne({ username });
  if (usernameAlreadyPresent)
    return res.status(401).json({ message: "Given username Already Exists" });

  let salt = bcrypt.genSaltSync(13);
  let hashPassword = await bcrypt.hash(password, salt);

  let newAdmin = new Admin({
    username,
    password: hashPassword,
  });
  await newAdmin.save().then(() => {
    console.log("Admin was created Successfully");
  });
  res.status(201).json({
    message: "Admin was created Successfully",
  });
  // res
  //   .status(201)
  //   .json({ message: "The admin has been registered successfully" });
};

module.exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  let user = await Admin.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid Username" });

  console.log(user);
  let isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid Password" });
  const token = jwt.sign({ userId: user._id }, "thisismysecret");

  res
    .status(201)
    .cookie("Authorization", token)
    .header("Authorisation", token)
    .send(token);
  //this token holds the userId so that we can decode the the token and get the Admin from there
};

module.exports.logoutAdmin = async (req, res) => {
  res
    .clearCookie("Authorization", { path: "/" })
    .status(201)
    .send("Admin was logout");
};
