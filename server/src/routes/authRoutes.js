import { Router } from "express";
import auth from "../middleware/authMiddleware.js";

// Import controller functions
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

const router = Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// CURRENT USER INFO
router.get("/me", auth, getMe);

// REFRESH TOKEN
router.post("/refresh", refreshToken);

// LOGOUT
router.post("/logout", logout);

// FORGOT PASSWORD → Send reset email
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD → Using token
router.post("/reset-password/:token", resetPassword);

export default router;
