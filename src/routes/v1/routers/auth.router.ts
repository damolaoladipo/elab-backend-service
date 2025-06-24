import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resendOTP,
  resetPassword,
  verifyOTP,
} from "../../../controllers/auth.controller";

const authRouter = Router({ mergeParams: true });

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", changePassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/resend-otp", resendOTP);
authRouter.post("/token", refreshToken);
authRouter.post("/logout", logoutUser);


export default authRouter;
