const express = require("express");
// multer : 파일 업로드를 위해 사용되는 multipart/form-data를
// 다루기 위한 node.js의 미들웨어
const multer = require("multer");
// dest: 목적지
// const upload = multer({ dest: "uploads" });
const { v4: uuid } = require("uuid");
const mime = require("mime-types");

// destination: 어디에 저장?
// filename: 어떤 이름으로 저장?
// cb: callback, file: 파일정보
// 만약 파일 저장을 차단하고 오류처리를 하고 싶은 경우가 있다면 cb의 첫번째 인자에 오류 객체를 입력해주면 되요. 아직 따로 검증을 적용하지 않았기 때문에 무조건 null을 입력하게 되고 이 경우는 성공처리가 됩니다.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({ storage });

const app = express();
const PORT = 6000;

// post 요청왔을 때 실행되는 함수
// 주소 바로 뒤에는 미들웨어의 위치이다.
// file: 파일정보
app.post("/upload", upload.single("imageTest"), (req, res) => {
  console.log(req.file);
  res.json(req.file);
});

app.listen(PORT, () => console.log("Express listening PORT: " + PORT));
