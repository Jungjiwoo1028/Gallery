const mongoose = require("mongoose");

// timestamps: 수정, 생성 시간등 자동생성
const ImageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("image", ImageSchema);
