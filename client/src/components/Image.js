import React, { useState, useEffect } from "react";

const Image = ({ imageUrl }) => {
  const [isError, setIsError] = useState(false);
  const [hashedUrl, setHashedUrl] = useState(imageUrl);

  useEffect(() => {
    let interavlId;
    if (isError && !interavlId) {
      interavlId = setInterval(
        () => setHashedUrl(`${imageUrl}#${Date.now()}`),
        100
      );
    } else if (!isError && interavlId) {
      clearInterval(interavlId);
    } else {
      setHashedUrl(imageUrl);
    }
    return () => clearInterval(interavlId);
  }, [isError, setHashedUrl, imageUrl]);

  return (
    <img
      alt=""
      src={hashedUrl}
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
      style={{ display: isError ? "none" : "block" }}
    />
  );
};

export default Image;
