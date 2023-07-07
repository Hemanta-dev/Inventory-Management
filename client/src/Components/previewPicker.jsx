import React, { useState } from 'react';

function FilePickerWithPreview() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
      />
      {selectedImage && (
        <img src={selectedImage} alt="Preview" />
      )}
    </div>
  );
}

export default FilePickerWithPreview;
