import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import { dbCon } from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./routes/AdminRoutes.js";
import passport from './passport-setup.js';
import googleAuth from "./routes/googleAuth.js";
import session from 'express-session';
import CompanyRoutes from "./routes/companyRoutes.js";
dotenv.config();
const app = express();

// Express session middleware
app.use(session({
  secret: '23423erer',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Databse Connection 
dbCon();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  credentials:true,
  origin : "http://localhost:5173"
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/company', CompanyRoutes);
app.use('/api/auth', googleAuth);

app.listen(process.env.PORT,()=>{
  console.log("Server is runnning");
});