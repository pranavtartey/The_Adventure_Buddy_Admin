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
  await camp.save().then(() => {
    console.log("The camp was created Sucessfully");
  });
  await school.camps.push(camp);
};

module.exports.registerStudent = async (req, res) => {
  const { schoolId, campId } = req.params;
  const school = await School.findById(schoolId);
  const camp = await Camp.findById(campId);
  const student = new Student({ ...req.body });
  await student.save().then(() => {
    console.log("The student was registered Successfully");
  });
  camp.students.push(student);
};
