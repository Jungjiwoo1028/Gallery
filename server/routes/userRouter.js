const userRouter = require("express").Router();
const User = require("../models/User");
const Image = require("../models/Image");
const { hash, compare } = require("bcryptjs");

userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    if (req.body.username.length < 3) {
      throw new Error("Username must be at least 3 characters");
    }
    const hashedPassword = await hash(req.body.password, 10); // 10: 숫자가 높을수록 salt수준이 높아진다
    const user = await new User({
      name: req.body.name,
      username: req.body.username,
      hashedPassword,
      sessions: [{ createdAt: new Date() }],
    }).save();
    const session = user.sessions[0]; // user.sessions[0]: 회원가입시 최소 세션위치
    res.json({
      message: "user registered",
      sessionId: session._id,
      name: user.name,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      throw new Error("ID does not exist.");
    }
    const isValid = await compare(req.body.password, user.hashedPassword);
    if (!isValid) {
      throw new Error("The information you entered is incorrect.");
    }
    user.sessions.push({ createdAt: new Date() });
    const session = user.sessions[user.sessions.length - 1]; // 최신 세션을 가져오기 위해서는 길이의 -1
    await user.save();
    res.json({
      message: "user validated",
      sessionId: session._id,
      name: user.name,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.patch("/logout", async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("invalid sessionId");
    }
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );
    res.json({ message: "user is logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/me", (req, res) => {
  try {
    if (!req.user) throw new Error("You do not have permission");
    res.json({
      message: "success",
      name: req.user.name,
      sessionId: req.headers.sessionid,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/me/images", async (req, res) => {
  // 본인 사진들만 리턴 (public === false)
  try {
    if (!req.user) throw new Error("You do not have permission");
    const images = await Image.find({ "user._id": req.user.id });
    res.json(images);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = { userRouter };
