import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  purchasedTickets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }],
}, {timestamps:true});

export const UserModel  = mongoose.model('user', userSchema);