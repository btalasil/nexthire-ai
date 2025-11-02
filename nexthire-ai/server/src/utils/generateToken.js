import jwt from 'jsonwebtoken';

export const generateToken = (id, exp = process.env.JWT_EXPIRES_IN || '1h') => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: exp });
};
