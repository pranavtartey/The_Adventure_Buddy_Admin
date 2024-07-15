const express = require("express");
const { getAllSchoolList } = require("../Controllers/Admin");

const Router = express.Router({ mergeParams: true });

Router.route("/").get(getAllSchoolList);

module.exports = Router;
