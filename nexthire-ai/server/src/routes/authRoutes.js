import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });

  return res.status(201).json({ message: "Registered", id: user._id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

// NEW: return current user profile (no password)
router.get("/me", auth, (req, res) => {
  res.json(req.user);
});

export default router;
