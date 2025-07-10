import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import {
  askAssistant,
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/user/current", isAuthenticated, getCurrentUser);
authRouter.post(
  "/user/update",
  isAuthenticated,
  upload.single("assistantImage"),
  updateAssistant
);
authRouter.post("/user/asktoassistant",isAuthenticated,askAssistant)

export default authRouter;
