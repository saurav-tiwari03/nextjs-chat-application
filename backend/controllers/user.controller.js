const User = require("../models/user.model");
const { successHandler, errorHandler } = require("./../utils/responseHandler");
const { generateAuthToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");

exports.login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (!user) {
      return errorHandler(res, null, "User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorHandler(res, null, "Invalid credentials");
    }
    const token = generateAuthToken(user);
    return successHandler(res, {
      user: { email: user.email, username: user.username, name: user.name },
      token,
    });
  } catch (error) {
    console.log("Login Error : ", error);
    errorHandler(res, error.message);
    next();
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, username, name } = req.body;
    if (!email || !password || !name || !username) {
      return errorHandler(res, null, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return errorHandler(
        res,
        null,
        "User already exists with this email or username"
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      email,
      username,
      name,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateAuthToken(newUser);

    return successHandler(res, {
      email: newUser.email,
      name: newUser.name,
      token,
    });
  } catch (error) {
    console.log("Register Error : ", error);
    errorHandler(res, error.message);
    next();
  }
};

exports.userNameAvailable = async (req, res, next) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({
      username: { $regex: username, $options: "i" },
    });
    if (user) {
      return successHandler(res, { available: false });
    }
    return successHandler(res, { available: true });
  } catch (error) {
    console.log("Check Username Error : ", error);
    errorHandler(res, error.message);
    next();
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const search = req.query.search;
    const users = await User.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ],
    });
    return successHandler(res, users);
  } catch (error) {
    console.log("Search User Error : ", error);
    errorHandler(res, error.message);
    next();
  }
};
