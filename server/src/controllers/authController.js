import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import crypto from "crypto";
import { Resend } from "resend";

// -----------------------------------------------------
// RESEND EMAIL CLIENT
// -----------------------------------------------------
const resend = new Resend(process.env.RESEND_API_KEY);

// -----------------------------------------------------
// GENERATE ACCESS TOKEN
// -----------------------------------------------------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

// -----------------------------------------------------
// SEND TOKENS (ACCESS + REFRESH)
// -----------------------------------------------------
const sendTokens = (res, user) => {
  const accessToken = generateToken(user._id);

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return accessToken;
};

// -----------------------------------------------------
// REGISTER
// -----------------------------------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
    });

    const token = sendTokens(res, user);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// LOGIN
// -----------------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = sendTokens(res, user);

    res.json({
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------------
// CURRENT USER
// -----------------------------------------------------
export const getMe = async (req, res) => {
  res.json(req.user);
};

// -----------------------------------------------------
// REFRESH TOKEN
// -----------------------------------------------------
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const access = generateToken(decoded.id);
    res.json({ token: access });
  } catch (err) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------
export const logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

// -----------------------------------------------------
// FORGOT PASSWORD (SEND EMAIL USING RESEND)
// -----------------------------------------------------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Email not found" });

  // Generate reset token
  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const html = `
    <h2>Password Reset Request</h2>
    <p>Click below to reset your password:</p>
    <a href="${resetURL}" 
       style="padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;">
       Reset Password
    </a>
    <p>If the button doesn't work, use this link:</p>
    <p>${resetURL}</p>
  `;

  try {
    await resend.emails.send({
      from: "NexthireAI <no-reply@nexthireai.in>",
      to: user.email,
      subject: "Reset Your Password",
      html,
    });

    return res.json({ message: "Reset email sent successfully" });
  } catch (err) {
    console.log("Resend email error:", err);
    return res.status(500).json({ message: "Email sending failed" });
  }
};

// -----------------------------------------------------
// RESET PASSWORD
// -----------------------------------------------------
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({ message: "Password updated successfully" });
};
