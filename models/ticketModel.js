import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketType: {
    type: String,
    enum: ["bus", "train", "airplane"],
    required: true,
  },
  departurePlace: {
    type: String,
    required: true,
  },
  arrivalPlace: {
    type: String,
    required: true,
  },
  noOfTickets: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  arrivalDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description:{
    type:String,
    required:true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  }
});

export const TicketModel = mongoose.model("Ticket", ticketSchema);
