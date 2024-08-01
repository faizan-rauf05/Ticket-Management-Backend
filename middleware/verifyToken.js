import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized : Token is not available" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized :User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden : User is not an admin" });
    }
    req.user = user;
    console.log(user);
    next();
  } catch (error) {}
};
