const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

/**
 * Register User
 */
const register = async (payload) => {
  const { email, password,name } = payload;
  console.log("wuduwgf", payload);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Member",
  });

  return user;
};

/**
 * Login User
 */
const login = async (payload) => {
  const { email, password, name } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    throw new Error("User Not Found.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

/**
 * Get Logged In User
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

module.exports = {
  register,
  login,
  getProfile,
};
