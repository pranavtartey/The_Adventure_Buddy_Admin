const express = require("express");
const {
  createSchool,
  getSchool,
  createCamp,
  registerStudent,
} = require("../Controllers/School");

const Router = express.Router({ mergeParams: true });

console.log("Inside the school routes")

Router.route("/create-school").post(createSchool);
Router.route("/get-school").get(getSchool);
Router.route("/create-camp").post(createCamp);
Router.route("/register-student").post(registerStudent);

module.exports = Router;
