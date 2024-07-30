import express from "express";
import {
  getTickets,
  getTicketDetails,
  addItemsToCart,
  updatePassword,
  getCartItems,
  getSingleBlog,
  deleteItemFromCart,
  updateUserProfile,
  uploadBlog,
  getAllBlogs,
  searchItems
} from "../controllers/userController.js";
import multer from "multer";
import path from "path";

// Muletr Storage
const storage = multer.diskStorage({
  destination: (res, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

const userRoutes = express.Router();

userRoutes.get("/tickets", getTickets);
userRoutes.get("/ticket-details/:id", getTicketDetails);
userRoutes.get("/blogs/:city", getAllBlogs);
userRoutes.get("/singleblog", getSingleBlog);
userRoutes.get("/cart/:id", getCartItems);
userRoutes.get("/search", searchItems);
userRoutes.post("/cart", addItemsToCart);
userRoutes.post("/profile/password/:id", updatePassword);
userRoutes.post("/blog", upload.single("file"), uploadBlog);
userRoutes.delete("/cart/item/:id/:userId", deleteItemFromCart);
userRoutes.put("/profile/:id", updateUserProfile);

export default userRoutes;
