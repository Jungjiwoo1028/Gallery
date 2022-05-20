const imageRouter = require("express").Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");

// 주소 바로 뒤에는 미들웨어의 위치이다.
// upload.single: 이름이 img인 이미지 하나를 받겠다는 뜻이다.
imageRouter.post("/", upload.single("image"), async (req, res) => {
  const image = await new Image({
    key: req.file.filename,
    originalFileName: req.file.originalname,
  }).save();
  res.json(image);
});
imageRouter.get("/", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = { imageRouter };
