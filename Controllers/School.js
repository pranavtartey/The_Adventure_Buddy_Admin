const School = require("../Models/School");
const Camp = require("../Models/Camp");
const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const { transporter } = require("../utils/mailTransporter");
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

module.exports.loginSchool = async (req, res) => {
  const { email, password } = req.body;
  let school = await School.findOne({ email });
  if (!school)
    return res.status(401).json({ message: "Invalid email or Password" });

  console.log(school);
  let isValidPassword = await bcrypt.compare(password, school.password);
  if (!isValidPassword)
    return res.status(401).json({ message: "Invalid Password or email" });
  const token = jwt.sign({ schoolId: school._id }, "thisismysecret");

  console.log(req.body);
  res.status(201).header("SchoolAuthorization", token).send(token);
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

  if (school.camps[0]) {
    res.status(201).json({
      schoolId: school._id,
      campId: school.camps[0]._id,
      schoolName: school.name,
      campName: school.camps[0].name,
      campVenue: school.camps[0].venue,
      campDate: `${new Date(school.camps[0].date).getDate()}/${
        new Date(school.camps[0].date).getMonth() + 1
      }/${new Date(school.camps[0].date).getFullYear()}`,
      message: "This is the camp data",
    });
  } else {
    res.status(201).json(false);
  }
  console.log(school);
  // res.status(201).json(school);
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

module.exports.queryMail = async (req, res) => {
  const { email, query, name, mobilenumber } = req.body;
  // console.log(req.body);
  // console.log(email);
  // console.log(mobilenumber);
  // console.log(name);
  // console.log(query);
  const userMailOptions = {
    from: "pranavtartey21@gmail.com",
    to: email,
    subject: "Successful query on The Adventure Buddy",
    text: "Thankyou for reaching out to us. Your query has been sent ;) We will reach out to you within 24 hrs",
  };

  const ownerMailOptions = {
    from: "pranavtartey21@gmail.com",
    to: "pranavtartey@gmail.com", // Replace with the owner's email address
    subject: "New Query from Customer",
    text: `You have received a new query from Name: ${name} Contact Number : ${mobilenumber} Email: ${email}. The query is as follows:\n\n${query}`,
  };

  transporter.sendMail(userMailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    transporter.sendMail(ownerMailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send("Emails sent: " + info.response);
    });
  });
};

module.exports.logoutSchool = async (req, res) => {
  res
    .clearCookie("SchoolAuthorization", { path: "/" })
    .status(201)
    .send("School was logout");
};
