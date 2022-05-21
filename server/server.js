require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { authentication } = require("./middleware/authentication");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");
const { MONGO_URI, PORT } = process.env;

// DB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected.");

    // express 변수에는 stastic이라는 메서드가 포함되어있습니다. 이 메서드를 미들웨어로서 로드해줍니다. static의 인자로 전달되는 'public'은 디렉터리의 이름입니다. 따라서 'public' 이라는 디렉터리 밑에 있는 데이터들은 웹브라우저의 요청에 따라 서비스를 제공해줄 수 있습니다.
    app.use("/uploads", express.static("uploads"));
    // request를 보고 json body가 있으면은 파싱해서 request.body에 저장을 해준다.
    app.use(express.json());
    app.use(authentication);
    app.use("/images", imageRouter); // -> /images로 시작되는 경로는 모두 imageRouter로 전송을 하라는 뜻
    app.use("/user", userRouter);
    app.listen(PORT, () => console.log("Express listening PORT: " + PORT));
  })
  .catch((err) => console.log(err));
