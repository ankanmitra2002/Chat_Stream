import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import sendMail from "../config/resetPassword.js";
import { generateResetToken, verifyResetToken } from "../config/tokenUtils.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photo } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All The Mandatory Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists && userExists.verified) {
    res.status(400);
    throw new Error("User already exists");
  }
  const existingOTP = await OTP.findOne({ email });
  if (existingOTP) {
    await OTP.findByIdAndDelete(existingOTP._id);
  }
  if (userExists) {
    await User.deleteOne({ email });
  }
  let user;
  try {
    user = await User.create({
      name,
      email,
      password,
      photo,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to create User");
  }

  const otp = generateOTP();
  const otpInstance = new OTP({ email, otp });
  try {
    await otpInstance.save();
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error("Failed to save OTP");
  }
  const subject = "OTP Verification for Chat-Stream Registration";
  const html = `<p>Your OTP for registration is: ${otp}</p>`;
  try {
    await sendMail({ to: email, subject, html });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    await OTP.findByIdAndDelete(otpInstance._id);
    res.status(500);
    throw new Error("Failed to send OTP to email");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const otpInstance = await OTP.findOne({ email });
  if (!otpInstance) {
    res.status(400);
    throw new Error("Invalid OTP");
  }
  const isMatch = await bcrypt.compare(otp, otpInstance.otp);
  if (!isMatch) {
    console.log("Otp does not match");
    res.status(400);
    throw new Error("Invalid OTP");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    user.verified = true;
    await user.save();
    await OTP.deleteOne({ _id: otpInstance._id });

    res.status(200).json({
      message: "OTP has been verified. Your registration is successful",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to verify OTP");
  }
});
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user.verified) {
    res.status(400);
    throw new Error("User already exists");
  }
  const existingOTP = await OTP.findOne({ email });
  if (existingOTP) {
    await OTP.findByIdAndDelete(existingOTP._id);
  }
  const otp = generateOTP();
  const otpInstance = new OTP({ email, otp });
  try {
    await otpInstance.save();
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error("Failed to save OTP");
  }
  const subject = "OTP Verification for Chat-Stream Registration";
  const html = `<p>Your OTP for registration is: ${otp}</p>`;
  try {
    await sendMail({ to: email, subject, html });
    res.status(200).json({
      message: "OTP has been resent successfully",
    });
  } catch (error) {
    await OTP.findByIdAndDelete(otpInstance._id);
    res.status(500);
    throw new Error("Failed to resend OTP to email");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.verified && (await user.matchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email id or Password");
  }
});
// api/user?search=username
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // const users = await User.find(keyword);
  res.send(users);
});

const resetPasswordRequest = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (user) {
    const token = generateResetToken(email);

    const resetPageLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;
    const subject = "Reset password for Chat-Stream";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to reset your password</p>`;

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ message: "User doesn't exist" });
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password, token } = req.body;

  const verifiedEmail = verifyResetToken(token);
  if (verifiedEmail && verifiedEmail === email) {
    const user = await User.findOne({ email });
    if (user) {
      user.password = password;
      await user.save();

      const subject = "Password successfully reset for Chat-Stream";
      const html = `<p>You have successfully reset your password.</p>`;
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  const { name, password, photo } = req.body;
  try {
    if (user) {
      user.name = name || user.name;
      user.photo = photo || user.photo;

      if (password) {
        user.password = password;
      }
      const updatedUser = await user.save();
      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        photo: updatedUser.photo,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400);
    throw new Error("Some Error Occurred!");
  }
});

export {
  registerUser,
  authUser,
  allUsers,
  resetPassword,
  resetPasswordRequest,
  verifyOTP,
  resendOTP,
  updateUserProfile,
};
