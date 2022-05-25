import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { setImgList, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef();

  const imageSelectHandler = async (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);

    const imagePreviews = await Promise.all(
      [...imageFiles].map(async (img) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(img); // 파일 읽어오기
            // onload: 읽기 동작이 성공적으로 완료되었을 때 발생
            fileReader.onload = (e) => {
              resolve({ imgSrc: e.target.result, fileName: img.name });
            };
          } catch (error) {
            reject(error);
          }
        });
      })
    );

    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // image라는 키로 file 값을 보낸다
    // content-type이란 간단히 말해 보내는 자원의 형식을 명시하기 위해 헤더에 실리는 정보 이다.
    for (let file of files) formData.append("image", file);
    formData.append("public", isPublic);
    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      if (isPublic) setImgList((prevData) => [...res.data, ...prevData]);
      setMyImages((prevData) => [...res.data, ...prevData]);
      toast.success("Success!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      setPercent(0);
      inputRef.current.value = null;
      toast.error(err.response.data.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const previewImages = previews.map((preview, i) => (
    <img
      key={i}
      src={preview.imgSrc}
      style={{ width: 200, height: 200, objectFit: "cover" }}
      alt=""
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  const title =
    previews.length === 0
      ? "upload images"
      : previews.reduce((prev, current) => prev + `${current.fileName},`, "");

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {title}
        <input
          ref={(ref) => (inputRef.current = ref)}
          multiple
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
        onChange={() => setIsPublic(!isPublic)}
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
