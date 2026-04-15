import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../modules/users/users.model.js';

const protect = asyncHandler(async (req, res, next) => {
  const cookieToken = req.cookies?.jwt;

  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  const tokenCandidates = [cookieToken, bearerToken].filter(Boolean);
  let lastError;

  for (const candidate of tokenCandidates) {
    try {
      const decoded = jwt.verify(candidate, process.env.JWT_SECRET);

      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
      return;
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    console.error(lastError);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }

  res.status(401);
  throw new Error('Not authorized, no token');
});

export { protect };
