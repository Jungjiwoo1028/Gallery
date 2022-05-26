const imageRouter = require("express").Router();
const Image = require("../models/Image");
const { upload } = require("../middleware/imageUpload");
// const fs = require("fs");
// const { promisify } = require("util");
const mongoose = require("mongoose");
const { s3, getSignedUrl } = require("../aws");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// const fileUnlink = promisify(fs.unlink); //fs.unlink를 promise함수화 시킨다.

imageRouter.post("/presigned", async (req, res) => {
  try {
    if (!req.user) throw new Error("You do not have permission");
    const { contentTypes } = req.body;
    if (!Array.isArray(contentTypes)) throw new Error("invalid contentTypes");

    const presignedData = await Promise.all(
      contentTypes.map(async (contentType) => {
        const imageKey = `${uuid()}.${mime.extension(contentType)}`;
        const key = `raw/${imageKey}`;
        const presigned = await getSignedUrl({ key });
        return { imageKey, presigned };
      })
    );

    res.json(presignedData);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

// 주소 바로 뒤에는 미들웨어의 위치이다.
// upload.single: 이름이 image인 이미지 하나를 받겠다는 뜻이다.
// upload.array("image", 5): image데이터를 최대 5장까지 받는다.
// imageRouter.post("/", upload.array("image", 5), async (req, res) => {
//   try {
//     if (!req.user) throw new Error("You do not have permission");

//     const images = await Promise.all(
//       req.files.map(async (file) => {
//         const image = await new Image({
//           user: {
//             _id: req.user.id, // _id 대신 id로 넣으면 String으로 넣어진다.
//             name: req.user.name,
//             username: req.user.username,
//           },
//           public: req.body.public,
//           key: file.key.replace("raw/", ""),
//           originalFileName: file.originalname,
//         }).save();
//         return image;
//       })
//     );

//     res.json(images);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: error.message });
//   }
// });

imageRouter.post("/", upload.array("image", 30), async (req, res) => {
  try {
    if (!req.user) throw new Error("You do not have permission");
    const { images, public } = req.body;

    const imageDocs = await Promise.all(
      images.map((image) =>
        new Image({
          user: {
            _id: req.user.id, // _id 대신 id로 넣으면 String으로 넣어진다.
            name: req.user.name,
            username: req.user.username,
          },
          public,
          key: image.imageKey,
          originalFileName: image.originalname,
        }).save()
      )
    );

    res.json(imageDocs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.get("/", async (req, res) => {
  try {
    const { lastId } = req.query;
    if (lastId && !mongoose.isValidObjectId(lastId))
      throw new Error("invalid lastId");

    // public 이미지만 제공
    const images = await Image.find(
      // $lt: < 작다라는 뜻
      lastId ? { public: true, _id: { $lt: lastId } } : { public: true }
    )
      .sort({
        _id: -1,
      })
      .limit(20);
    res.json(images);
  } catch (erorr) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.get("/:imageId", async (req, res) => {
  try {
    const { imageId } = req.params;
    if (!mongoose.isValidObjectId(imageId))
      throw new Error("You do not have permission");
    const image = await Image.findOne({ _id: imageId });
    if (!image) throw new Error("This image isn't exist");
    if (!image.public && (!req.user || req.user.id !== image.user.id))
      throw new Error("This image isn't exist");
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  // 1. uploads 폴더에 있는 사진 삭제
  // 2. 디비에 있는 image 문서를 삭제
  try {
    if (!req.user) throw new Error("You do not have permission");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("You do not have permission");

    const image = await Image.findByIdAndDelete({ _id: req.params.imageId });
    if (!image) {
      throw new Error("This image has already been deleted");
    }
    // await fileUnlink(`./uploads/${image.key}`);
    s3.deleteObject(
      {
        Bucket: "image-upload-gallery",
        Key: `raw/${image.key}`,
      },
      (error, data) => {
        if (error) throw error;
        console.log(data);
      }
    );
    res.json({ message: "Your image is deleted." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  // 유저권환확인
  // like 중복 방지
  try {
    if (!req.user) throw new Error("You do not have permission");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("You do not have permission");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $addToSet: { likes: req.user.id } }, // $addToSet: 중복되지 않게 값을 넣어준다 (중복허용은 $push)
      { new: true } // new: true = 원래는 업데이트 되기전의 것을 리턴해주기 때문에 업데이트 후의 데이터를 리턴하기 위해 설정해줘야한다.
    );
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // 유저권환확인
  // unlike 중복 방지
  try {
    if (!req.user) throw new Error("You do not have permission");
    if (!mongoose.isValidObjectId(req.params.imageId))
      throw new Error("You do not have permission");

    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.id } },
      { new: true }
    );
    res.json(image);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = { imageRouter };
