const express = require("express");
const app = express();
const PORT = 8000;

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

// express 변수에는 stastic이라는 메서드가 포함되어있습니다. 이 메서드를 미들웨어로서 로드해줍니다. static의 인자로 전달되는 'public'은 디렉터리의 이름입니다. 따라서 'public' 이라는 디렉터리 밑에 있는 데이터들은 웹브라우저의 요청에 따라 서비스를 제공해줄 수 있습니다.
// app.use()는 미들웨어 기능을 마운트하거나 지정된 경로에 마운트하는 데 사용된다.
app.use("/uploads", express.static("uploads"));

// 주소 바로 뒤에는 미들웨어의 위치이다.
// upload.single: 이름이 img인 이미지 하나를 받겠다는 뜻이다.
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

app.listen(PORT, () => console.log("Express listening PORT: " + PORT));
