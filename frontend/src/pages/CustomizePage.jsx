import React, { useContext, useRef } from "react";
import Card from "../components/Card";
import image1 from "../assets/image_1.png";
import image2 from "../assets/image_2.png";
import image3 from "../assets/image_3.png";
import image4 from "../assets/image_4.png";
import image5 from "../assets/image_5.png";
import { FaImage } from "react-icons/fa6";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const CustomizePage = () => {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const inputImage = useRef();
  const navigateTo = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBackendImage(file);
      setFrontendImage(previewUrl);
      setSelectedImage(previewUrl); // ✅ store uploaded image URL as selectedImage
    }
  };

  const images = [image1, image2, image3, image4, image5];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Assistant Avatar
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Select from our collection of AI avatars or upload your own custom image
          </p>
        </div>

        {/* Image Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12 max-w-6xl">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => {
                setBackendImage(null); // clear backend image if predefined is selected
                setFrontendImage(img);
                setSelectedImage(img); // ✅ set selectedImage to predefined image URL
              }}
              className={`group relative w-32 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                selectedImage === img
                  ? "ring-4 ring-purple-400 ring-opacity-60 shadow-2xl shadow-purple-500/25 scale-105"
                  : "hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
              }`}
            >
              {/* Gradient Border */}
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1 ${
                selectedImage === img ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              } transition-opacity duration-300`}>
                <div className="w-full h-full rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={img}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Fallback without gradient border */}
              {selectedImage !== img && (
                <div className="absolute inset-0 bg-gray-800 rounded-2xl overflow-hidden group-hover:opacity-0 transition-opacity duration-300">
                  <img
                    src={img}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Selection Indicator */}
              {selectedImage === img && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}

          {/* Upload Custom Image */}
          <div
            className={`group relative w-32 h-40 md:w-40 md:h-52 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
              selectedImage === frontendImage && frontendImage
                ? "ring-4 ring-purple-400 ring-opacity-60 shadow-2xl shadow-purple-500/25 scale-105"
                : "hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20"
            }`}
            onClick={() => inputImage.current.click()}
          >
            {/* Gradient Border */}
            <div className={`absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-1 ${
              selectedImage === frontendImage && frontendImage ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            } transition-opacity duration-300`}>
              <div className="w-full h-full rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="Custom upload"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Fallback without gradient border */}
            {(!frontendImage || selectedImage !== frontendImage) && (
              <div className="absolute inset-0 bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center group-hover:opacity-0 transition-opacity duration-300">
                {frontendImage ? (
                  <img
                    src={frontendImage}
                    alt="Custom upload"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Upload</span>
                  </div>
                )}
              </div>
            )}

            {/* Selection Indicator */}
            {selectedImage === frontendImage && frontendImage && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            {/* Upload Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl">
              <div className="text-white text-center">
                <FaImage className="w-6 h-6 mx-auto mb-1" />
                <span className="text-xs font-medium">
                  {frontendImage ? "Change" : "Upload"}
                </span>
              </div>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={inputImage}
            onChange={handleImage}
            hidden
          />
        </div>

        {/* Next Button */}
        {selectedImage && (
          <div className="flex justify-center">
            <button
              onClick={() => navigateTo("/customizeName")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Continue</span>
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
              
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomizePage;