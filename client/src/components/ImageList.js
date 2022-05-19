import { ImageContext } from "../context/ImageContext";
import React, { useContext } from "react";

const ImageList = () => {
  const [imgList] = useContext(ImageContext);

  return (
    <div>
      {imgList.map((item, i) => (
        <img
          style={{ width: "100%", marginTop: "15px" }}
          src={`http://localhost:8000/uploads/${item.key}`}
          key={i}
        />
      ))}
    </div>
  );
};

export default ImageList;
