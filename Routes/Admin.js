const express = require("express");
const {
  getAllSchoolList,
  loginAdmin,
  registerAdmin,
  logoutAdmin,
} = require("../Controllers/Admin");
const { catchAsync, verifyAdmin } = require("../Middlewares/Middleware");
const Router = express.Router({ mergeParams: true });

Router.route("/all-schools").get(verifyAdmin, getAllSchoolList);
Router.route("/register-admin").post(registerAdmin);
Router.route("/login-admin").post(loginAdmin);
Router.route("/logout-admin").get(logoutAdmin);

module.exports = Router;
