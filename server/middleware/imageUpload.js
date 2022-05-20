const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// 만약 파일 저장을 차단하고 오류처리를 하고 싶은 경우가 있다면 cb의 첫번째 인자에 오류 객체를 입력해주면 되요. 아직 따로 검증을 적용하지 않았기 때문에 무조건 null을 입력하게 되고 이 경우는 성공처리가 됩니다.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});

// fileFilter.cb에 2번째 인자(boolean)으로 인해 사진을 저장할지 말지 결정한다.
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png"].includes(file.mimetype)) cb(null, true);
    else cb(new Error("invalid file type"), false);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
});

module.exports = { upload };
