import { TicketModel } from "../models/ticketModel.js";
import { SalesModel } from "../models/salesModel.js";

// Get all Ticket
export const getTickets = async (req, res) => {
  try {
    const allTickets = await TicketModel.find();
    if (!allTickets) {
      return res
        .status(404)
        .json({ success: false, message: "No any ticket found" });
    }
    res.status(200).json({ success: true, allTickets });
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
  const { departurePlace, arrivalPlace, quantity, totalPrice, id, ticketId } =
    req.body;
  try {
    const existedItem = await SalesModel.findOne({ ticketId });
    if (existedItem) {
      existedItem.quantity += parseInt(quantity);
      await existedItem.save();
      const originalTicket = await TicketModel.findById(ticketId);
      if (originalTicket) {
        originalTicket.noOfTickets -= quantity;
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
      });
      await cartItem.save();
      const originalTicket = await TicketModel.findById(ticketId);
      if (originalTicket) {
        originalTicket.noOfTickets -= quantity;
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
    const cartItems = await SalesModel.find({ userId: id });
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
    res.status(200).json({ success: true,message:"Item deleted successfully", fetchRemainingCartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
