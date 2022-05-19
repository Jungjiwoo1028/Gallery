import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = (props) => {
  const [imgList, setImgList] = useState([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((res) => {
        setImgList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <ImageContext.Provider value={[imgList, setImgList]}>
      {props.children}
    </ImageContext.Provider>
  );
};
