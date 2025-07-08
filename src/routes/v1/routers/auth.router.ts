import { Router } from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../../../controllers/auth.controller";
import Protect from "../../../middlewares/checkAuth.mdw";

const authRouter = Router({ mergeParams: true });

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/logout", logoutUser);
authRouter.get("/user", Protect, getUser);

export default authRouter;
