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
  const [me] = useContext(AuthContext);
  const { imgList, setImgList, setMyImages } = useContext(ImageContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = imgList.find((img) => img._id === imageId);
    if (img) setImage(img);
    console.log(img);
  }, [imgList, imageId]);

  console.log(image);

  useEffect(() => {
    if (image && image._id === imageId) return;
    axios
      .get(`/images/${imageId}`)
      .then(({ data }) => {
        setImage(data);
        setError(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
      });
  }, [imageId, image]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  if (error) return <h3>Error</h3>;
  else if (!image) return <h3>Loading...</h3>;

  const updateImage = (images, newImg) =>
    [...images.filter((newImg) => newImg._id !== imageId), newImg].sort(
      (a, b) => {
        if (a._id < b._id) return 1;
        else return -1;
      }
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public)
      setImgList((prevData) => updateImage(prevData, result.data));
    setMyImages((prevData) => updateImage(prevData, result.data));

    setHasLiked(!hasLiked);
  };

  const deleteImage = (img) => img.filter((image) => image._id !== imageId);

  const deleteHandler = async (e) => {
    try {
      if (!window.confirm("You want delete this image?")) return;
      await axios.delete(`/images/${imageId}`);
      toast.success("Delete success", {
        position: "top-right",
        autoClose: 1000,
      });
      setImgList((prevData) => deleteImage(prevData));
      setMyImages((prevData) => deleteImage(prevData));
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
        src={`https://d386ju3uugfq0r.cloudfront.net/w600/${image.key}`}
      />
      <span style={{ fontSize: "25px" }}>💗 {image.likes.length}</span>
      {me && image.user._id === me.userId && (
        <button
          onClick={deleteHandler}
          style={{
            float: "right",
            marginLeft: 10,
            fontSize: "20px",
            fontFamily: "DelaGothicOne",
            borderRadius: "20px",
            borderStyle: "none",
            cursor: "pointer",
            backgroundColor: "#5541f5",
            color: "#d3fd54",
            marginTop: "5px",
          }}
        >
          Delete
        </button>
      )}
      <button
        onClick={onSubmit}
        style={{
          float: "right",
          backgroundColor: "#000",
          marginTop: "5px",
          fontSize: "25px",
          borderStyle: "none",
          cursor: "pointer",
        }}
      >
        {hasLiked ? "👎" : "👍"}
      </button>
    </div>
  );
};

export default ImagePage;
