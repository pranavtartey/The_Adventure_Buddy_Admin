const express = require("express");
const {
  createSchool,
  getSchool,
  loginSchool,
  logoutSchool,
  createCamp,
  registerStudent,
  fetchSchoolData,
  queryMail,
  validSchool,
} = require("../Controllers/School");
const { catchAsync } = require("../utils/catchAsync");
const { verifyRegister, verifySchool } = require("../Middlewares/Middleware");

const Router = express.Router({ mergeParams: true });

console.log("Inside the school routes");

Router.route("/login-school").post(catchAsync(loginSchool));
Router.route("/logout-school").get(catchAsync(logoutSchool));
Router.route("/create-school").post(catchAsync(createSchool));
Router.route("/get-school").get(verifySchool, catchAsync(getSchool));
Router.route("/create-camp").post(verifySchool, catchAsync(createCamp));
Router.route("/:schoolId/:campId/register-student").post(
  verifyRegister,
  catchAsync(registerStudent)
);
Router.route("/unique-code").post(fetchSchoolData);
Router.route("/query").post(queryMail);
Router.route("/school-unique-id-code").post(validSchool);

module.exports = Router;
