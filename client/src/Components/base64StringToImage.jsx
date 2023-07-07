import React, { useRef, useEffect } from "react";

const base64ToBlob = (base64String, contentType) => {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const blob = new Blob([new Uint8Array(byteArrays)], { type: contentType });
  return blob;
};

const ImageComponent = ({ base64String, contentType }) => {
  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && base64String) {
      const blob = base64ToBlob(base64String, contentType);
      const imageUrl = URL.createObjectURL(blob);
      imageRef.current.src = imageUrl;
    }
  }, [base64String, contentType]);

  return <img ref={imageRef} className="imageConvert" />;
};

export default ImageComponent;





