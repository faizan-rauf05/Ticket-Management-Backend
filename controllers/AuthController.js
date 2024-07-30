import { UserModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CompanyModel } from "../models/companyModel.js";
import axios from "axios";

const SECRET_KEY = "6LcqQxgqAAAAANxJxeITsNFZ7i4qaD1aMj7DrAB-";

// Register 

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res.status(200).json({ message: "Registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password, loginType, reCaptcha } = req.body;

    if (!email || !password || !loginType || !reCaptcha) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const recaptchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${reCaptcha}`
    );

    if (!recaptchaResponse.data.success) {
      return res.status(400).json({ success: false, message: "reCAPTCHA verification failed" });
    }

    let user;
    if (loginType === "user" || loginType === "admin") {
      user = await UserModel.findOne({ email });
    } else {
      user = await CompanyModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Logged in successfully", user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Logout 
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

export const companyrRegister = async (req, res) => {
  const { companyName, country, province, email, password } = req.body;
  try {
    if (!companyName || !country || !province || !email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All the fields are required" });
    }

    const existEmail = await CompanyModel.findOne({ email });

    if (existEmail) {
      return res
        .status(404)
        .json({ success: false, message: "Company already exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCompany = new CompanyModel({
      companyName,
      country,
      province,
      email,
      password : hashedPassword ,
    });
    await newCompany.save();
    res
      .status(200)
      .json({ success: true, message: "Company registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};
