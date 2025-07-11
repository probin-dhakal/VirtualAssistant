import React, { useContext, useState } from "react";
import bg from "../assets/authImage.png";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import toast from "react-hot-toast";

const SignIn = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const navigateTo = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      toast.success("Login successful!");
      navigateTo("/");
    } catch (error) {
      setUserData(null);
      console.log("Error while login", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] px-[20px] h-[500px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-2xl shadow-black flex flex-col items-center justify-center gap-[20px]"
        onSubmit={handleSignin}
      >
        <p className="text-white text-[27px] mb-2 font-bold">
          Sign in to your{" "}
          <span className="text-red-500 font-extrabold">Virtual Assistant</span>
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full h-[60px] px-[20px] py-[10px] rounded-full text-[18px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Enter your password"
            className="w-full h-full px-[20px] py-[10px] rounded-full text-[18px] outline-none bg-transparent text-white placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isPasswordVisible ? (
            <IoMdEyeOff
              className="absolute top-[17px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setIsPasswordVisible(false)}
            />
          ) : (
            <IoMdEye
              className="absolute top-[17px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setIsPasswordVisible(true)}
            />
          )}
        </div>

        <button
          type="submit"
          className={`min-w-[150px] h-[52px] rounded-full text-[18px] font-semibold mt-[10px] ${
            loading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-white text-black"
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <hr className="w-full border-gray-400" />

        <p
          className="text-white text-[17px] cursor-pointer"
          onClick={() => navigateTo("/signup")}
        >
          Don't have an account? <span className="text-blue-500">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
