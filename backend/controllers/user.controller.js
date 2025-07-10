import { response } from "express";
import uploadToCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getCurrent user controller");
    return res.status(500).json({
      message: "Get user error",
    });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadToCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in update assistant user controller", error);
    return res.status(500).json({
      message: "Update Assistant error",
    });
  }
};

export const askAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);
    user.history+=command
    user.save();
    const userName = user.name;
    const assistantImage = user.assistantImage;
    const assistantName = user.assistantName;

    const result = await geminiResponse(command, assistantName, userName);

    const JsonMatch = result.match(/{[\s\S]*}/);

    if (!JsonMatch) {
      return res.status(400).json({
        response: "Sorry, I can't understand",
      });
    }
    const gemResult = JSON.parse(JsonMatch[0]);
    const type = gemResult.type;

    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });
      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });
      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });
      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("MMMM")}`,
        });
      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "general":
      case "calculator_open":
      case "facebook_open":
      case "weather_show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        return res.status(400).json({
          response: "I didn't understand that command.",
        });
    }
  } catch (error) {
    console.log("Ask Assistant Error: ", error);
    return res.status(400).json({
      response: "Ask assistant error: ",
    });
  }
};
