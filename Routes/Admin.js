const express = require("express");
const { schoolsList } = require("../Controllers/Admin");

const Router = express.Router({ mergeParams: true });

Router.route("/").get(schoolsList);

module.exports = Router;
