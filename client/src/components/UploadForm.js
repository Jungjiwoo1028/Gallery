import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { setImgList, setMyImages, imgList, myImages } =
    useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [percent, setPercent] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const onSubmitV2 = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const presignedData = await axios.post("/images/presigned", {
        contentTypes: [...files].map((file) => file.type),
      });

      await Promise.all(
        [...files].map((file, i) => {
          const { presigned } = presignedData.data[i];
          const formData = new FormData();
          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }
          formData.append("Content-Type", file.type);
          formData.append("file", file);
          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setPercent((prevData) => {
                const newData = [...prevData];
                newData[i] = Math.round((100 * e.loaded) / e.total);
                return newData;
              });
            },
          });
        })
      );

      const res = await axios.post("/images", {
        images: [...files].map((file, i) => ({
          imageKey: presignedData.data[i].imageKey,
          originalname: file.name,
        })),
        public: isPublic,
      });
      console.log(res);
      if (isPublic) setImgList((prevData) => [...res.data, ...prevData]);
      setMyImages((prevData) => [...res.data, ...prevData]);

      toast.success("Success!", {
        position: "top-right",
        autoClose: 1000,
      });
      setTimeout(() => {
        setPercent([]);
        setPreviews([]);
        inputRef.current.value = null;
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setPercent([]);
      setPreviews([]);
      setIsLoading(false);
      inputRef.current.value = null;
      toast.error(error.response.data.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   // image라는 키로 file 값을 보낸다
  //   // content-type이란 간단히 말해 보내는 자원의 형식을 명시하기 위해 헤더에 실리는 정보 이다.
  //   for (let file of files) formData.append("image", file);
  //   formData.append("public", isPublic);
  //   try {
  //     const res = await axios.post("/images", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       onUploadProgress: (e) => {
  //         setPercent(Math.round((100 * e.loaded) / e.total));
  //       },
  //     });
  //     if (isPublic) setImgList((prevData) => [...res.data, ...prevData]);
  //     setMyImages((prevData) => [...res.data, ...prevData]);
  //     toast.success("Success!", {
  //       position: "top-right",
  //       autoClose: 1000,
  //     });
  //     setTimeout(() => {
  //       setPercent(0);
  //       setPreviews([]);
  //       inputRef.current.value = null;
  //     }, 3000);
  //   } catch (err) {
  //     setPercent(0);
  //     inputRef.current.value = null;
  //     toast.error(err.response.data.message, {
  //       position: "top-right",
  //       autoClose: 2000,
  //     });
  //   }
  // };

  const previewImages = previews.map((preview, i) => (
    <div key={i} style={{ margin: "1px" }}>
      <img
        src={preview.imgSrc}
        style={{ width: 120, height: 120, objectFit: "cover" }}
        alt=""
        className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
      />
      <ProgressBar percent={percent[i]} />
    </div>
  ));

  const title =
    previews.length === 0
      ? "upload images"
      : previews.reduce((prev, current) => prev + `${current.fileName},`, "");

  return (
    <form onSubmit={onSubmitV2}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        {previewImages}
      </div>
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
      <div
        style={{
          alignItems: "end",
          marginBottom: "10px",
          marginTop: "-5px",
        }}
      >
        <input
          type="checkbox"
          id="public-check"
          value={!isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label
          htmlFor="public-check"
          style={{ fontSize: "15px", marginLeft: "2px" }}
        >
          private
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="button" disabled={isLoading} type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
