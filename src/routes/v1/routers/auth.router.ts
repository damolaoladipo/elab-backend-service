import { Router } from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  uploadImage,
} from "../../../controllers/auth.controller";
import Protect from "../../../middlewares/checkAuth.mdw";
import uploadFile from "../../../middlewares/upload.mdw";

const authRouter = Router({ mergeParams: true });

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);
authRouter.post("/logout", logoutUser);
authRouter.get("/user", Protect, getUser);
authRouter.post("/image", Protect, uploadFile, uploadImage);

authRouter.get("/reset-password", (req, res) => {
  res.render("emails/reset-password", {
    title: "Reset Password",
  });
});

authRouter.get("/forgot-password", (req, res) => {
  res.render("emails/forgot-password", {
    title: "Reset Password",
  });
});

export default authRouter;
