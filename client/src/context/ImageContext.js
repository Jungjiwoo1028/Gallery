import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((res) => {
        setImgList(res.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <ImageContext.Provider value={[imgList, setImgList]}>
      {children}
    </ImageContext.Provider>
  );
};
