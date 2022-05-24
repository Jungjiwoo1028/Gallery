import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ImagePage = () => {
  const { imageId } = useParams();
  const { imgList, myImages, setImgList, setMyImages } =
    useContext(ImageContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [me] = useContext(AuthContext);

  const image =
    imgList.find((img) => img._id === imageId) ||
    myImages.find((img) => img._id === imageId);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);
  if (!image) return <h3>Loading...</h3>;

  const updateImage = (images, newImg) =>
    [...images.filter((newImg) => newImg._id !== imageId), newImg].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) setImgList(updateImage(imgList, result.data));
    else setMyImages(updateImage(myImages, result.data));

    setHasLiked(!hasLiked);
  };

  return (
    <div>
      <h3>Image page</h3>
      <img
        style={{ width: "100%" }}
        alt={imageId}
        src={`http://localhost:8000/uploads/${image.key}`}
      />
      <span>Like: {image.likes.length}</span>
      <button onClick={onSubmit} style={{ float: "right" }}>
        {hasLiked ? "unlike" : "like"}
      </button>
    </div>
  );
};

export default ImagePage;
