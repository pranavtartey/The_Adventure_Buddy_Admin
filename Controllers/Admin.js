const School = require("../Models/School");
const Camp = require("../Models/Camp");
const Student = require("../Models/Student");

module.exports.getAllSchoolList = async (req, res) => {
  const schoolsList = await School.find({})
    .populate("students")
    .populate("camps");
  //getting all the schools (full schools document)
  res.status(201).json(schoolsList);
};
