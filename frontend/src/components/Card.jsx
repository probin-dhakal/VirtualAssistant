import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);

  return (
    <div
      className={`w-[80px] h-[160px] lg:w-[160px] lg:h-[260px] bg-[#03031d] border-2 border-[#08088a] rounded-[18px] overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white ${
        selectedImage === image
          ? "border-4 hover:shadow-2xl hover:shadow-blue-950 border-white"
          : null
      }`}
      onClick={() => {
        setSelectedImage(image);
        setFrontendImage(null);
        setBackendImage(null)
      }}
    >
      <img src={image} alt="card" className="w-full h-full object-cover" />
    </div>
  );
};

export default Card;
