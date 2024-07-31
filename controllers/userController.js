import { TicketModel } from "../models/ticketModel.js";
import { SalesModel } from "../models/salesModel.js";
import { UserModel } from "../models/userModel.js";
import { BlogModel } from "../models/blogModel.js";
import bcrypt from "bcrypt";

// Get all Ticket
export const getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 8 } = req.query;
    const skip = (page - 1) * limit;
    const tickets = await TicketModel.find().skip(skip).limit(parseInt(limit));
    const totalTickets = await TicketModel.countDocuments();

    res.status(200).json({
      success: true,
      tickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single ticket details

export const getTicketDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const ticketDetails = await TicketModel.findOne({ _id: id });
    if (!ticketDetails) {
      return res
        .status(404)
        .json({ success: false, message: "No any ticket found" });
    }
    res.status(200).json({ success: true, ticketDetails });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add items to Cart

export const addItemsToCart = async (req, res) => {
  const {
    departurePlace,
    arrivalPlace,
    quantity,
    totalPrice,
    id,
    ticketId,
    ticketType,
  } = req.body;
  try {
    const existedItem = await SalesModel.findOne({
      ticketId,
      "payment.status": "pending",
    });
    if (existedItem) {
      existedItem.quantity += parseInt(quantity);
      await existedItem.save();
      const originalTicket = await TicketModel.findById(ticketId);
      if (originalTicket) {
        await originalTicket.save();
      }
      return res
        .status(200)
        .json({ message: "Cart item updated successfully" });
    }
    if (!existedItem) {
      const cartItem = new SalesModel({
        departurePlace,
        arrivalPlace,
        quantity,
        totalPrice,
        userId: id,
        ticketId,
        ticketType,
      });
      await cartItem.save();
      const originalTicket = await TicketModel.findById(ticketId);
      if (originalTicket) {
        await originalTicket.save();
      }
    }
    res.status(200).json({ success: true, message: "Item added in cart" });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Cart Items

export const getCartItems = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItems = await SalesModel.find({
      userId: id,
      "payment.status": "pending",
    });
    if (!cartItems) {
      return res
        .status(404)
        .json({ success: false, message: "No any item found" });
    }
    res.status(200).json({ success: true, cartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete items from cart

export const deleteItemFromCart = async (req, res) => {
  const { id, userId } = req.params;
  try {
    const deleteItem = await SalesModel.findByIdAndDelete(id);
    const fetchRemainingCartItems = await SalesModel.find({ userId });
    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      fetchRemainingCartItems,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update User profile

export const updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  const { id } = req.params;
  try {
    const updatedProfile = await UserModel.findByIdAndUpdate(
      id,
      {
        name,
        email,
      },
      { new: true }
    );
    if (!updatedProfile) {
      return res
        .status(404)
        .json({ success: "false", message: "Profile not found" });
    }
    res.status(200).json({
      success: "true",
      message: "Profile updated successfully",
      updatedProfile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Upload Blog

export const uploadBlog = async (req, res) => {
  const { file } = req;
  const { title, city, blog } = req.body;
  try {
    if (!title || !city || !blog || !file) {
      return res
        .status(400)
        .json({ success: false, message: "Kindly fill all fields" });
    }
    const saveData = new BlogModel({
      title,
      image: file.filename,
      city,
      blog,
    });
    await saveData.save();
    return res
      .status(200)
      .json({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get All Blogs

export const getAllBlogs = async (req, res) => {
  const { city } = req.params;
  const arrivalPlace = city;
  try {
    const getBlogs = await BlogModel.find({ city: arrivalPlace }); // Query the database
    if (!getBlogs || getBlogs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No blogs found" });
    }
    return res.status(200).json({ success: true, getBlogs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single blog details
export const getSingleBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const singleBlogDetails = await BlogModel.findOne({ id });
    if (!singleBlogDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, singleBlogDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update users password

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;
  try {
    if (!oldPassword || !newPassword) {
      return res
        .status(404)
        .json({ success: "false", message: "Please fill all fields" });
    }
    const user = await UserModel.findOne({ _id: id });
    const verifyPassword = await bcrypt.compare(oldPassword, user.password);
    if (!verifyPassword) {
      return res
        .status(404)
        .json({ success: "false", message: "Password not match" });
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error);
  }
};

// Search Items 

export const searchItems = async (req, res) => {
  const { departure, arrival } = req.query;
  const searchTickets = await TicketModel.find({
    $expr: {
      $and: [
        { $eq: [{ $toLower: "$departurePlace" }, departure.toLowerCase()] },
        { $eq: [{ $toLower: "$arrivalPlace" }, arrival.toLowerCase()] }
      ]
    }
  });
  if (!searchTickets) {
    return res
      .status(404)
      .json({ success: false, message: "No tickets found" });
  }
  res.status(200).json({ success: true, searchTickets });
};
