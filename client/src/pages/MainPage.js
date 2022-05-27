import React, { useContext } from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";
import { AuthContext } from "../context/AuthContext";

const MainPage = () => {
  const [me] = useContext(AuthContext);
  return (
    <>
      {me && <UploadForm />}
      <ImageList />
    </>
  );
};

export default MainPage;
