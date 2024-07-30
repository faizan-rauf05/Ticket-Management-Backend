import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbCon } from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./routes/AdminRoutes.js";
// import passport from './passport-setup.js';
// import googleAuth from "./routes/googleAuth.js";
// import session from 'express-session';
import CompanyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { stripePayment } from "./controllers/stripeController.js";
import bodyParser from "body-parser";
import Stripe from "stripe";
import { afterStripe } from "./controllers/stripeController.js";


dotenv.config();
const app = express();

// Express session middleware
// app.use(session({
//   secret: '23423erer',
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// Databse Connection
dbCon();

// app.use("/webhook");

app.post("/webhook",bodyParser.raw({ type: "application/json" }), afterStripe);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.static("public"));

app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/user", userRoutes);
// app.use('/api/auth', googleAuth);
app.post("/api/create-checkout-session", stripePayment);


app.listen(process.env.PORT, () => {
  console.log("Server is runnning");
});


