const School = require("../Models/School");
const Camp = require("../Models/Camp");
const Student = require("../Models/Student");

module.exports.createSchool = async (req, res) => {
  const newSchool = new School({ ...req.body });
  console.log(req.body);
  await newSchool.save().then(() => {
    console.log("School was created Successfully");
  });
  console.log(newSchool);
  res.status(201).json({ message: "The school was created successfully" });
};

module.exports.getSchool = async (req, res) => {
  const { schoolId } = req.params;
  const school = await School.findById(schoolId)
    .populate("camps")
    .populate("students");
  res.status(201).json(school);
};

module.exports.createCamp = async (req, res) => {
  const camp = new Camp({ ...req.body });
  const { schoolId } = req.params;
  const school = await School.findById(schoolId);
  console.log(camp);
  console.log(school);
  school.camps.push(camp);
  await school.save();
  await camp.save().then(() => {
    console.log("The camp was created Sucessfully");
  });
  res.status(201).json({ message: "The camp was created successfully" });
};

module.exports.registerStudent = async (req, res) => {
  const { schoolId, campId } = req.params;
  const school = await School.findById(schoolId);
  console.log(school);
  const camp = await Camp.findById(campId);
  console.log(camp);
  const student = new Student({ ...req.body });
  console.log(student);
  camp.students.push(student);
  await camp.save();
  await student.save().then(() => {
    console.log("The student was registered Successfully");
  });
  res.status(201).json({ message: "The student was registered successfully" });
};
