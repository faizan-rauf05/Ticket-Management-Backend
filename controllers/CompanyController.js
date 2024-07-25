import { TicketModel } from "../models/ticketModel.js";
import { CompanyModel } from "../models/companyModel.js";
import bcrypt from "bcrypt";

export const createTicket = async (req, res) => {
  const {
    ticketType,
    departurePlace,
    arrivalPlace,
    noOfTickets,
    departureDate,
    arrivalDate,
    companyId,
    price,
    description,
  } = req.body;

  try {
    // Check if all required fields are provided
    if (
      !ticketType ||
      !departurePlace ||
      !arrivalPlace ||
      !noOfTickets ||
      !departureDate ||
      !arrivalDate ||
      !price ||
      !description
    ) {
      return res.status(400).json({ message: "All the fields are required" });
    }

    // Validate and format dates
    const parsedDepartureDate = new Date(departureDate);
    const parsedArrivalDate = new Date(arrivalDate);

    if (
      isNaN(parsedDepartureDate.getTime()) ||
      isNaN(parsedArrivalDate.getTime())
    ) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const formattedDepartureDate = parsedDepartureDate.toISOString();
    const formattedArrivalDate = parsedArrivalDate.toISOString();

    // Convert the ticketType to a lower case and remove spaces
    const lowerTicketType = ticketType.toLowerCase();
    const cleanedTicketType = lowerTicketType.replace(/\s+/g, "");

    // Create a new ticket
    const newTicket = new TicketModel({
      ticketType: cleanedTicketType,
      departurePlace,
      arrivalPlace,
      noOfTickets,
      departureDate: formattedDepartureDate,
      arrivalDate: formattedArrivalDate,
      companyId,
      price,
      description,
    });

    // Save the ticket
    await newTicket.save();

    res
      .status(200)
      .json({ success: true, message: "Ticket added successfully" });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Tickets

export const getTickets = async (req, res) => {
  const companyId = req.params.id;
  try {
    const tickets = await TicketModel.find({ companyId });
    if (!tickets) {
      return res
        .status(404)
        .json({ status: "fail", message: "No any ticket available" });
    }
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get Tickets By id

export const getTicketById = async (req, res) => {
  try {
    const id = req.params.id;
    const ticketData = await TicketModel.findOne({ _id: id });
    if (!ticketData) {
      return res.status(404).json({ message: "Ticket with this id not found" });
    }
    res.status(200).json(ticketData);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Ticket Data

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const {
    departurePlace,
    arrivalPlace,
    noOfTickets,
    price,
    description,
    departureDate,
    arrivalDate,
    companyId,
  } = req.body;

  try {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      id,
      {
        departurePlace,
        arrivalPlace,
        noOfTickets,
        price,
        description,
        departureDate,
        arrivalDate,
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }
    const remainingTickets = await TicketModel.find({ companyId });
    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      remainingTickets,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete Ticket

export const deleteTicket = async (req, res) => {
  const { id, companyId } = req.params;
  try {
    const deleteTicket = await TicketModel.findByIdAndDelete(id);
    if (!deleteTicket) {
      res.status(404).json({ status: "fail", message: "Ticket not found" });
    }
    const remainingTickets = await TicketModel.find({ companyId });
    res
      .status(200)
      .json({ status: "success", message: "Ticket deleted successfully", remainingTickets });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Company Profile

export const updateCompanyProfile = async (req, res) => {
  const { companyName, country, province, email } = req.body;
  const { id } = req.params;
  try {
    const updatedProfile = await CompanyModel.findByIdAndUpdate(
      id,
      {
        companyName,
        country,
        province,
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

// Update Password

export const updateCompanyPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const {id} = req.params;
  try {
    const user  = await CompanyModel.findOne({_id:id});
    const verifyPassword = await bcrypt.compare(oldPassword, user.password);
    if(!verifyPassword){
      return res.status(404).json({success:"false", message:"Password not match"});
    }
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    res.status(200).json({success:true, message:"Password changed successfully"});
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    console.log(error)
  }
};
