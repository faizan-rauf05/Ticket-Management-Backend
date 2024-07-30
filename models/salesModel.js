import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  departurePlace: {
    type: String,
    required: true,
  },
  arrivalPlace: {
    type: String,
    required: true,
  },
  ticketType: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  payment: {
    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
    },
  },
});

export const SalesModel = mongoose.model("Sales", salesSchema);
