import { ImageContext } from "../context/ImageContext";
import React, { useContext, useRef, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";
import { Link } from "react-router-dom";

const ImageList = () => {
  const {
    imgList,
    isPublic,
    setIsPublic,
    imageError,
    imageLoading,
    setImageUrl,
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  const loaderMoreImages = useCallback(() => {
    if (imgList.length === 0 || imageLoading) return;
    const lastId = imgList[imgList.length - 1]._id;
    setImageUrl(`${isPublic ? "" : "/user/me"}/images?lastId=${lastId}`);
  }, [imgList, imageLoading, isPublic, setImageUrl]);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loaderMoreImages();
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [loaderMoreImages]);

  const list = imgList.map((item, i) => (
    <Link
      to={`/images/${item._id}`}
      key={i}
      ref={i + 5 === imgList.length ? elementRef : undefined}
    >
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
      {imageError && <div>Error</div>}
      {imageLoading && <div>Loading...</div>}
    </div>
  );
};

export default ImageList;
