import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiLogOut, FiSettings, FiMenu, FiX, FiMic, FiVolume2, FiUser } from "react-icons/fi";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <FiUser className="text-white" size={20} />
          </div>
          <span className="text-white font-medium">
            Welcome, {userData?.name || "User"}
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => navigateTo("/customize")}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <FiSettings size={18} />
            <span>Customize</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-full text-red-300 font-medium hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <FiLogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-20 right-6 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-xl p-4 space-y-3 z-20">
          <button
            onClick={() => {
              navigateTo("/customize");
              setMenuOpen(false);
            }}
            className="w-full px-4 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
          >
            <FiSettings size={18} />
            <span>Customize</span>
          </button>
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="w-full px-4 py-3 bg-red-500/20 rounded-lg text-red-300 font-medium hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <FiLogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-6">
        {/* Assistant Avatar */}
        <div className="relative mb-8">
          <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
              {userData?.assistantImage ? (
                <img
                  src={userData.assistantImage}
                  alt="Assistant"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="text-gray-400" size={120} />
                </div>
              )}
            </div>
          </div>
          
          {/* Status Ring */}
          <div className={`absolute inset-0 rounded-full border-4 transition-all duration-500 ${
            speaking ? 'border-green-400 animate-pulse' : 
            listening ? 'border-blue-400 animate-pulse' : 
            'border-gray-500'
          }`}></div>
        </div>

        {/* Assistant Name */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
          I am{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {userData?.assistantName || "Your Assistant"}
          </span>
        </h1>

        {/* Status Display */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 max-w-md w-full text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {speaking ? (
              <div className="flex items-center space-x-2 text-green-400">
                <FiVolume2 size={24} className="animate-pulse" />
                <span className="text-lg font-medium">Speaking...</span>
              </div>
            ) : listening ? (
              <div className="flex items-center space-x-2 text-blue-400">
                <FiMic size={24} className="animate-pulse" />
                <span className="text-lg font-medium">Listening...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-6 h-6 rounded-full bg-gray-500 animate-pulse"></div>
                <span className="text-lg font-medium">Ready</span>
              </div>
            )}
          </div>
          
          {/* Visual Indicator */}
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-8 rounded-full transition-all duration-300 ${
                  speaking ? 'bg-green-400 animate-pulse' :
                  listening ? 'bg-blue-400 animate-pulse' :
                  'bg-gray-600'
                }`}
                style={{
                  animationDelay: `${i * 0.1}s`,
                  height: speaking || listening ? `${20 + Math.random() * 20}px` : '8px'
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <p className="text-gray-300 mt-8 text-center max-w-lg leading-relaxed">
          Say "{userData?.assistantName || "Assistant"}" followed by your command to get started.
        </p>
      </div>
    </div>
  );
};

export default Home;