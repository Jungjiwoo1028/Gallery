import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ImagePage = () => {
  const navigate = useNavigate();
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

  const deleteImage = (img) => img.filter((image) => image._id !== imageId);

  const deleteHandler = async (e) => {
    try {
      if (!window.confirm("You want delete this image?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success("Delete success", {
        position: "top-right",
        autoClose: 1000,
      });
      setImgList(deleteImage(imgList));
      setMyImages(deleteImage(myImages));
      navigate("/");
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
      });
    }
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
      {me && image.user._id === me.userId && (
        <button
          onClick={deleteHandler}
          style={{ float: "right", marginLeft: 10 }}
        >
          Delete
        </button>
      )}
      <button onClick={onSubmit} style={{ float: "right" }}>
        {hasLiked ? "unlike" : "like"}
      </button>
    </div>
  );
};

export default ImagePage;
