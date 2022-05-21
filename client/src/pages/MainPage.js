import React from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";

const MainPage = () => {
  return (
    <>
      <h2>Gallery</h2>
      <UploadForm />
      <ImageList />
    </>
  );
};

export default MainPage;
