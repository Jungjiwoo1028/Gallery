import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imgList, setImgList] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  const [me] = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/images")
      .then((res) => {
        setImgList(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (me) {
      setTimeout(() => {
        axios
          .get("/user/me/images")
          .then((result) => setMyImages(result.data))
          .catch((error) => console.log(error));
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        imgList,
        setImgList,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
