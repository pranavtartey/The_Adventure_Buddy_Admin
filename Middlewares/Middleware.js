const Camp = require("../Models/Camp");

module.exports.verifyRegister = async (req, res, next) => {
  const { campId } = req.params;
  const camp = await Camp.findById(campId);
  const timeNow = new Date().getTime();
  if (camp.date <= timeNow) {
    return res.status(201).json({
      message: "The time for the registeration process has exceeded :(",
    });
  }
  next();
};
