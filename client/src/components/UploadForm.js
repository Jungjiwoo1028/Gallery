import React, { useState, useContext } from "react";
import axios from "axios";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { imgList, setImgList, myImages, setMyImages } =
    useContext(ImageContext);
  const defaultFileName = "Upload your file";
  const [fileName, setFileName] = useState(defaultFileName);
  const [file, setFile] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const imageSelectHandler = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile); // 파일 읽어오기
    // onload: 읽기 동작이 성공적으로 완료되었을 때 발생
    fileReader.onload = (e) => {
      setImgSrc(e.target.result);
    };
  };

  const onSubmit = async (e) => {
    // 기본적으로 submit버튼을 누르면 페이지가 새로고침된다.
    // 하지만 이건 SPA로서 의미가 없어지기 때문에 기본동작을 막아준다.
    e.preventDefault();
    const formData = new FormData();
    // image라는 키로 file 값을 보낸다
    // content-type이란 간단히 말해 보내는 자원의 형식을 명시하기 위해 헤더에 실리는 정보 이다.
    formData.append("image", file);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      if (isPublic) setImgList([...imgList, res.data]);
      else setMyImages([...myImages, res.data]);
      toast.success("Success!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <img
        alt=""
        src={imgSrc}
        className={`image-preview ${imgSrc && "image-preview-show"}`}
      />
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          accept="image/*"
          id="image"
          type="file"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        value={!isPublic}
        onChange={(e) => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">private</label>
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
