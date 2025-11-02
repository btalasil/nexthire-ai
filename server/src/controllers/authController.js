const sendTokens = (res, user) => {
  const accessToken = generateToken(user._id, '15m');
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7*24*60*60*1000
  });
  return accessToken;
};

import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = sendTokens(res, user);
    res.json({ user: { _id: user._id, name: user.name, email: user.email }, token });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = sendTokens(res, user);
    res.json({ user: { _id: user._id, name: user.name, email: user.email }, token });
  } catch (e) { next(e); }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ message: 'No refresh token' })
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const access = generateToken(decoded.id, '15m')
    res.json({ token: access })
  } catch (e) {
    e.status = 401
    next(e)
  }
}

export const logout = async (_req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV==='production' })
  res.json({ ok: true })
}
