import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Upload the file.");

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
  };

  const onSubmit = async (e) => {
    // 기본적으로 submit버튼을 누르면 페이지가 새로고침된다.
    // 하지만 이건 SPA로서 의미가 없어지기 때문에 기본동작을 막아준다.
    e.preventDefault();
    const formData = new FormData();
    // image라는 키로 file 값을 보낸다
    formData.append("image", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log({ res });
      console.log("success");
    } catch (err) {
      console.log("faile");
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="image">{fileName}</label>
      <input id="image" type="file" onChange={imageSelectHandler} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default UploadForm;
