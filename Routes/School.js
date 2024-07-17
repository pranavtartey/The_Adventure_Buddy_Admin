const express = require("express");
const {
  createSchool,
  getSchool,
  createCamp,
  registerStudent,
} = require("../Controllers/School");

const Router = express.Router({ mergeParams: true });

console.log("Inside the school routes");

Router.route("/create-school").post(createSchool);
Router.route("/get-school/:schoolId").get(getSchool);
Router.route("/:schoolId/create-camp").post(createCamp);
Router.route("/:schoolId/:campId/register-student").post(registerStudent);

module.exports = Router;
