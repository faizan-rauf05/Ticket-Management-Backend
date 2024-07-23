import mongoose from "mongoose";

const companyModel = new mongoose.Schema({
  companyName : {
    type : String,
    required : true
  },
  country :{
    type :String,
    required : true
  },
  province :{
    type :String,
    required : true
  },
  email :{
    type :String,
    required : true
  },
  password :{
    type : String,
    required : true
  },
  role :{
    type : String,
    default : "company"
  }
});

export const CompanyModel = mongoose.model("Company", companyModel);