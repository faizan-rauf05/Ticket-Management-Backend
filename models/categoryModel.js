import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName : {
    type : String,
    required : true
  },
  description:{
    type : String,
    required : true,
  }
});

export const categoryModel = mongoose.model('category',categorySchema);