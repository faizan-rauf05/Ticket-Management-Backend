import { UserModel } from "../models/userModel.js";
import { categoryModel } from "../models/categoryModel.js";
import { TicketModel } from "../models/ticketModel.js";
import { CompanyModel } from "../models/companyModel.js";
import { SalesModel } from "../models/salesModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    if (!users) {
      return res
        .status(404)
        .json({ status: false, message: "No any users found" });
    }
    const filteredUsers = users.filter((currUser) => currUser.role !== "admin");
    res.status(200).json({ success: true, filteredUsers });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Create Categories

export const createCategory = async (req, res) => {
  const { categoryName, description } = req.body;

  try {
    const categoryExist = await categoryModel.findOne({ categoryName });

    if (categoryExist) {
      return res
        .status(400)
        .json({ success: false, error: "Category already exists" });
    }

    const newCategory = new categoryModel({
      categoryName,
      description,
    });

    await newCategory.save();
    res
      .status(200)
      .json({ success: true, message: "Category added successfully" });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch All Categories

export const fetchAllCategories = async (req, res) => {
  try {
    const allCatrgories = await categoryModel.find();
    res.status(200).json(allCatrgories);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Fetch All Tickets
export const fetchAllTickets = async (req, res) => {
  try {
    const allTickets = await TicketModel.find();
    if (!allTickets) {
      return res
        .status(404)
        .json({ success: false, message: "Not any ticket found" });
    }
    res.status(200).json(allTickets);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Fetch All Companies
export const fetchAllCompanies = async (req, res) => {
  try {
    const allCompanies = await CompanyModel.find();
    if (!allCompanies) {
      return res
        .status(404)
        .json({ success: false, message: "Not any company found" });
    }
    return res.status(200).json({ success: false, allCompanies });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Delete Company

export const deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteCompany = await CompanyModel.findByIdAndDelete(id);
    const remainingCompanies = await CompanyModel.find();
    if (!remainingCompanies) {
      return res
        .status(404)
        .json({ success: false, message: "Not any company found" });
    }
    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      remainingCompanies,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Delete Users;

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await UserModel.findByIdAndDelete(id);
    const remainingUsers = await UserModel.find();
    const filteredUsers = remainingUsers.filter(
      (currUser) => currUser.role !== "admin"
    );
    console.log(remainingUsers);
    if (!remainingUsers) {
      return res
        .status(404)
        .json({ success: false, message: "Not any company found" });
    }
    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      filteredUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// Delete Ticket

export const deleteTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTicket = await TicketModel.findByIdAndDelete(id);
    if (!deleteTicket) {
      res.status(404).json({ status: "fail", message: "Ticket not found" });
    }
    const remainingTickets = await TicketModel.find();
    res
      .status(200)
      .json({
        status: "success",
        message: "Ticket deleted successfully",
        remainingTickets,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Analytics

export const analytics = async (req, res) => {
  try {
    const fetchSalesData = await SalesModel.find();
    console.log(fetchSalesData);
    const busData = fetchSalesData.filter(
      (currTicket) => currTicket.ticketType == "bus"
    );
    const trainData = fetchSalesData.filter(
      (currTicket) => currTicket.ticketType == "train"
    );
    const airplaneData = fetchSalesData.filter(
      (currTicket) => currTicket.ticketType == "airplane"
    );
    if (!fetchSalesData) {
      return res
        .status(404)
        .json({ success: false, message: "No any data found" });
    }
    res
      .status(200)
      .json({
        success: true,
        fetchSalesData,
        busData,
        trainData,
        airplaneData,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Fetch All Orders

export const fetchAllOrders = async (req, res) => {
  try {
    const paidOrders = await SalesModel.find({ "payment.status": "paid" });

    if (!paidOrders) {
      return res.status(404).json({ success: false, message: "No any orders" });
    }
    res.status(200).json({ success: true, paidOrders });
  } catch (error) {
    console.log(error);
  }
};
