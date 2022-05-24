import { ImageContext } from "../context/ImageContext";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";
import { Link } from "react-router-dom";

const ImageList = () => {
  const { imgList, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const list = (isPublic ? imgList : myImages).map((item, i) => (
    <Link to={`/images/${item._id}`} key={i}>
      <img
        alt=""
        style={{ marginTop: "15px" }}
        src={`http://localhost:8000/uploads/${item.key}`}
      />
    </Link>
  ));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2>My Gallery ({isPublic ? "public" : "private"})</h2>
        {me && (
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => setIsPublic(!isPublic)}
          >
            show {isPublic ? "private" : "public"} images
          </button>
        )}
      </div>
      <div className="image-list-container">{list}</div>
    </div>
  );
};

export default ImageList;
