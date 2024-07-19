const Camp = require("../Models/Camp");
const jwt = require("jsonwebtoken");

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

module.exports.verifyAdmin = async (req, res, next) => {
  const auth = req.cookies.Authorization;
  if (!auth) return res.status(401).json({ message: "Invalid Token :(" });

  try {
    const verify = jwt.verify(auth, process.env.TOKEN_SECRET);
    console.log(verify);
    // req.username = verify;
    next();
  } catch (error) {
    res.send(error);
  }
};
