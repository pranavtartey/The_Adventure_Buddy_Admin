const express = require("express");
const {
  createSchool,
  getSchool,
  loginSchool,
  logoutSchool,
  createCamp,
  registerStudent,
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

module.exports = Router;
