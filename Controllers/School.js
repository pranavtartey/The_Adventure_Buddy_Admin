const School = require("../Models/School");
const Camp = require("../Models/Camp");
const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

module.exports.createSchool = async (req, res) => {
  const { name, address, state, city, email, password, pincode } = req.body;
  const schoolAlreadyPresent = await School.findOne({ email });
  if (schoolAlreadyPresent)
    return res.status(401).json({ message: "Given username Already Exists" });

  let salt = bcrypt.genSaltSync(13);
  let hashPassword = await bcrypt.hash(password, salt);

  let newSchool = new School({
    name,
    address,
    state,
    city,
    pincode,
    email,
    password: hashPassword,
  });

  // const newSchool = new School({ ...req.body });
  console.log(req.body);
  await newSchool.save().then(() => {
    console.log("School was created Successfully");
  });
  console.log(newSchool);
  res.status(201).json({ message: "The school was created successfully" });
};

module.exports.loginSchool = async (req, res, next) => {
  const { email, password } = req.body;
  let school = await School.findOne({ email });
  if (!school) return res.status(401).json({ message: "Invalid Username" });

  console.log(school);
  let isValidPassword = await bcrypt.compare(password, school.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid Password" });
  const token = jwt.sign({ schoolId: school._id }, "thisismysecret");

  res
    .status(201)
    .cookie("SchoolAuthorization", token)
    .header("SchoolAuthorisation", token)
    .send(token);
  // console.log(req.body);
};

module.exports.getSchool = async (req, res) => {
  const { schoolId } = req;
  console.log(schoolId);
  // const school = await School.findById(schoolId)
  //   .populate("camps")
  //   .populate("students");
  const school = await School.findById(schoolId)
    .populate({
      path: "camps",
      match: { date: { $gte: new Date().getTime() } }, // Filter camps by date
    })
    .populate("students");
  console.log(school);
  res.status(201).json(school);
  // console.log(req.schoolId);
  // res
  //   .status(201)
  //   .json({ message: "This is your school we are checking the middleware!!!" });
};

module.exports.createCamp = async (req, res) => {
  const { name, date, venue } = req.body;
  const campTime = new Date(date).getTime();
  const camp = new Camp({
    name,
    date: campTime,
    venue,
  });
  await camp.save().then(() => {
    console.log("The camp was created Sucessfully");
  });
  const { schoolId } = req;
  const school = await School.findById(schoolId);
  school.camps.push(camp);
  await school.save();
  console.log(camp);
  console.log(school);

  res.status(201).json({ message: "The camp was created successfully" });
};

module.exports.fetchSchoolData = async (req, res, next) => {
  const { uniqueCode } = req.body;
  const school = await School.findById(uniqueCode)
    .populate({
      path: "camps",
      match: { date: { $gte: new Date().getTime() } }, // Filter camps by date
    })
    .populate("students");
  console.log(school);
  res.status(201).json(school);
};

module.exports.registerStudent = async (req, res) => {
  const { schoolId, campId } = req.params;
  const school = await School.findById(schoolId);
  console.log(school);
  const camp = await Camp.findById(campId);
  console.log(camp);
  const student = new Student({ ...req.body });
  await student.save().then(() => {
    console.log("The student was registered Successfully");
  });
  console.log(student);
  camp.students.push(student);
  camp.studentCount += 1;
  await camp.save();
  res.status(201).json({ message: "The student was registered successfully" });
};

module.exports.logoutSchool = async (req, res) => {
  res
    .clearCookie("Authorization", { path: "/" })
    .status(201)
    .send("School was logout");
};
