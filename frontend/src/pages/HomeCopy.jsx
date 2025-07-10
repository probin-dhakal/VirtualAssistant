import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLogOut, FiSettings, FiMenu, FiX } from "react-icons/fi";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigateTo = useNavigate();
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const recognitionRef = useRef(null);
  const isSpeaking = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigateTo("/signin");
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error while logging out: ", error);
    }
  };

  const speak = (text) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        isSpeaking.current = true;
        setSpeaking(true);
      };
      utterance.onend = () => {
        isSpeaking.current = false;
        setSpeaking(false);
        resolve();
      };
      synth.speak(utterance);
    });
  };

  const handleCommand = async (data) => {
    if (!data) return;

    const { type, userInput, response } = data;
    await speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    } else if (type === "youtube_search" || type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    } else if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    } else if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    } else if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    } else if (type === "weather_show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    }
  };

  useEffect(() => {
    if (userData?.name && userData?.assistantName) {
      const greet = async () => {
        const greeting = `Hello ${userData.name}, I am ${userData.assistantName}. How can I help you?`;
        await speak(greeting);
      };
      greet();
    }
  }, [userData?.name, userData?.assistantName]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.log("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    const isRecognizing = { current: false };

    const safeRecognitionStart = () => {
      try {
        if (!isSpeaking.current && !isRecognizing.current) {
          recognition.start();
        }
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Recognition start error:", error);
        }
      }
    };

    recognition.onstart = () => {
      console.log("Recognition started");
      isRecognizing.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizing.current = false;
      setListening(false);

      if (!isSpeaking.current) {
        setTimeout(() => safeRecognitionStart(), 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizing.current = false;
      setListening(false);

      if (event.error !== "aborted") {
        setTimeout(() => safeRecognitionStart(), 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        const data = await getGeminiResponse(transcript);
        console.log("Gemini:", data);
        await handleCommand(data);
      }
    };

    safeRecognitionStart();

    const fallbackInterval = setInterval(() => {
      if (!isSpeaking.current && !isRecognizing.current) {
        safeRecognitionStart();
      }
    }, 10000);

    return () => {
      recognition.stop();
      clearInterval(fallbackInterval);
    };
  }, [getGeminiResponse, userData.assistantName]);

  // Determine which GIF to show
  let statusGif = "/demo.gif";
  let statusText = "Idle";
  if (speaking) {
    statusGif = "/speak.gif";
    statusText = "Speaking...";
  } else if (listening) {
    statusGif = "/mic.gif";
    statusText = "Listening...";
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#090964f3] flex justify-center items-center flex-col gap-[15px] relative">
      {/* Desktop Menu - Hidden on mobile */}
      <div className="absolute top-[20px] right-[20px] flex-col gap-[10px] hidden md:flex">
        <button
          type="button"
          onClick={() => navigateTo("/customize")}
          className="min-w-[150px] h-[52px] bg-white rounded-full text-black text-[18px] px-[20px] font-semibold flex items-center justify-center gap-2"
        >
          <FiSettings size={22} /> Customize
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="min-w-[150px] h-[52px] bg-white rounded-full text-black text-[18px] font-semibold flex items-center justify-center gap-2"
        >
          <FiLogOut size={22} /> Log Out
        </button>
      </div>

      {/* Mobile Hamburger Menu Button - Only visible on mobile */}
      <div className="absolute top-[20px] right-[20px] md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-[50px] h-[50px] bg-white rounded-full text-black flex items-center justify-center"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown - Only visible on mobile when open */}
      {menuOpen && (
        <div className="absolute top-[80px] right-[20px] bg-white rounded-lg shadow-lg p-4 flex flex-col gap-3 md:hidden z-10">
          <button
            type="button"
            onClick={() => {
              navigateTo("/customize");
              setMenuOpen(false);
            }}
            className="w-full h-[45px] bg-gray-100 rounded-lg text-black text-[16px] font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <FiSettings size={20} /> Customize
          </button>
          <button
            type="button"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full h-[45px] bg-gray-100 rounded-lg text-black text-[16px] font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <FiLogOut size={20} /> Log Out
          </button>
        </div>
      )}

      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-3xl shadow-2xl relative">
        {userData?.assistantImage ? (
          <img
            src={userData.assistantImage}
            alt="Assistant"
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-white">No assistant image</p>
        )}
      </div>

      <h1 className="text-white text-[25px] font-semibold">
        I am{" "}
        <span className="text-red-500 font-bold">
          {userData?.assistantName || "Unnamed Assistant"}
        </span>
      </h1>

      <div className="flex flex-col items-center mt-2">
        <img
          src={statusGif}
          alt="Status Animation"
          className="w-[180px] h-[180px]"
        />
        <p className="text-white mt-2">{statusText}</p>
      </div>
    </div>
  );
};

export default Home;
