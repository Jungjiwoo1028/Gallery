import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [imgList, setImgList] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);
  const pastImageUrl = useRef();

  useEffect(() => {
    if (pastImageUrl.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((res) => {
        isPublic
          ? setImgList((prevData) => [...prevData, ...res.data])
          : setMyImages((prevData) => [...prevData, ...res.data]);
      })
      .catch((error) => {
        console.log(error);
        setImageError(true);
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrl.current = imageUrl;
      });
  }, [imageUrl, isPublic]);

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
        imgList: isPublic ? imgList : myImages,
        setImgList,
        setMyImages,
        isPublic,
        setIsPublic,
        imageLoading,
        imageError,
        setImageUrl,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
