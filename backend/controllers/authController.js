// controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        msg: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await user.save();

    await sendEmail(email, otp);

    res.status(201).json({
      msg: "OTP sent successfully 📩",
    });

  } catch (err) {
    console.log("SIGNUP ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        msg: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      msg: "Verified successfully ✅",
    });

  } catch (err) {
    console.log("VERIFY OTP ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // CHECK PASSWORD
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        msg: "Wrong password",
      });
    }

    // VERIFY ACCOUNT
    if (!user.isVerified) {
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpiry = Date.now() + 5 * 60 * 1000;

      await user.save();

      await sendEmail(email, otp);

      return res.json({
        msg: "OTP sent again",
      });
    }

    // GENERATE JWT TOKEN
    const token = generateToken(user);

    // COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
    });

    // SEND RESPONSE
    res.json({
      msg: "Login success ✅",
      token,
      role: user.role,
      userId: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err.message);

    res.status(500).json({
      error: err.message,
    });
  }
};