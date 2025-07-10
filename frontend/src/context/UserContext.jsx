import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl = "https://virtualassistant-9yco.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log("Current user data:", result.data);
    } catch (error) {
      console.log("Error while fetching current user:", error);
      setUserData(null); // clear userData on error or unauthenticated
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/user/asktoassistant`,
        { command },
        {
          withCredentials: true,
        }
      );
      return result.data;
    } catch (error) {
      console.log("Error in getGeminiResponse context: ", error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData, // optionally expose this for manual updates
    refreshUser: handleCurrentUser,
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
