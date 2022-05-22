const mongoose = require("mongoose");
const User = require("../models/User");

// next: 통과시키기
const authentication = async (req, res, next) => {
  const { sessionid } = req.headers;
  console.log(sessionid);

  // isValidObjectId: session형태인지 확인
  if (!sessionid || !mongoose.isValidObjectId(sessionid)) return next();
  const user = await User.findOne({ "sessions._id": sessionid });
  if (!user) return next();
  req.user = user;
  return next();
};

module.exports = { authentication };
