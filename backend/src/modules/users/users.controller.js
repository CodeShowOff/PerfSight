import asyncHandler from 'express-async-handler';
import User from './users.model.js';
import generateToken from '../../utils/generateToken.js';
import Joi from 'joi';

// ── Input validation schemas ──
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(128),
}).min(1);

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details.map((d) => d.message).join(', '));
  }

  const email = String(value.email).toLowerCase().trim();
  const { password } = value;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details.map((d) => d.message).join(', '));
  }

  const { name, password } = value;
  const email = String(value.email).toLowerCase().trim();

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    res.status(400);
    throw new Error(error.details.map((d) => d.message).join(', '));
  }

  const user = await User.findById(req.user._id);

  if (user) {
    if (value.name) {
      user.name = value.name;
    }

    if (value.email) {
      const normalizedEmail = String(value.email).toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const emailTaken = await User.findOne({ email: normalizedEmail });
        if (emailTaken) {
          res.status(400);
          throw new Error('Email already in use');
        }
        user.email = normalizedEmail;
      }
    }

    if (value.password) {
      user.password = value.password;
    }

    const updatedUser = await user.save();

    // Re-issue token to keep response body and cookie in sync.
    const token = generateToken(res, updatedUser._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
