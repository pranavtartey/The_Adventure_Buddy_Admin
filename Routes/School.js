const express = require("express");
const {
  createSchool,
  getSchool,
  createCamp,
  registerStudent,
} = require("../Controllers/School");
const { catchAsync } = require("../utils/catchAsync");
const { verifyRegister } = require("../Middlewares/Middleware");

const Router = express.Router({ mergeParams: true });

console.log("Inside the school routes");

Router.route("/create-school").post(catchAsync(createSchool));
Router.route("/get-school/:schoolId").get(catchAsync(getSchool));
Router.route("/:schoolId/create-camp").post(catchAsync(createCamp));
Router.route("/:schoolId/:campId/register-student").post(
  verifyRegister,
  catchAsync(registerStudent)
);

module.exports = Router;
