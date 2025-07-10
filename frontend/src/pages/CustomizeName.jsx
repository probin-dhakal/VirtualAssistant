import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
const CustomizeName = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false); // ✅ loading state

  const navigateTo = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      setLoading(true); // ✅ set loading true before API call

      let formData = new FormData();
      formData.append("assistantName", assistantName);

      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else if (selectedImage) {
        formData.append("imageUrl", selectedImage);
      } else {
        console.log("No image selected.");
        setLoading(false);
        return;
      }

      const result = await axios.post(
        `${serverUrl}/api/auth/user/update`,
        formData,
        { withCredentials: true }
      );

      console.log(result.data);
      setUserData(result.data);
      navigateTo("/"); // ✅ navigate after success
    } catch (error) {
      console.log("Error in customize name page: ", error);
    } finally {
      setLoading(false); // ✅ set loading false after API call completes
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex justify-center items-center flex-col p-3">
      <IoMdArrowRoundBack size={"30px"} className="absolute top-[30px] left-[30px] text-white" onClick={()=>navigateTo("/customize")}/>
      <h1 className="text-white text-[25px] text-center p-[20px] mb-4 font-semibold">
        Enter your{" "}
        <span className="text-[#c41212] font-bold">Assistant Name</span>
      </h1>

      <input
        type="text"
        placeholder="eg: Jarvis"
        className="w-full max-w-[500px] h-[60px] px-[20px] py-[10px] rounded-full text-[18px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300"
        onChange={(e) => setAssistantName(e.target.value)}
        value={assistantName}
      />

      {assistantName && (
        <button
          className={`min-w-[290px] h-[52px] rounded-full text-black text-[18px] font-semibold mt-[15px] ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-white"
          }`}
          disabled={loading} // ✅ disable when loading
          onClick={handleUpdateAssistant}
        >
          {loading ? "Creating..." : "Create Your Assistant"} {/* ✅ button text */}
        </button>
      )}
    </div>
  );
};

export default CustomizeName;
