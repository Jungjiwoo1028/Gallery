import React, { useState } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";

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
    // content-type이란 간단히 말해 보내는 자원의 형식을 명시하기 위해 헤더에 실리는 정보 이다.
    formData.append("image", file);
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("success!");
    } catch (err) {
      toast.error(err.message);
      console.log(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="file-dropper">
        {fileName}
        <input id="image" type="file" onChange={imageSelectHandler} />
      </div>
      <button
        type="submit"
        style={{
          width: "100%",
          borderRadius: "3px",
          height: "40px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default UploadForm;
