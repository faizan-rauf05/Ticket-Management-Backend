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
  totalPrice: {
    type: Number,
    required: true,
  },
  quantity:{
    type:Number,
    required:true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  ticketId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  }
});

export const SalesModel = mongoose.model("Sales", salesSchema);
