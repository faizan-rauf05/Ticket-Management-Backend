import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbCon } from "./utils/db.js";
import AuthRoutes from "./routes/Auth.js";
import cookieParser from "cookie-parser";
import AdminRoutes from "./routes/AdminRoutes.js";
import CompanyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { stripePayment, afterStripe } from "./controllers/stripeController.js";
import bodyParser from "body-parser";
import { realtimeFlightsData } from "./controllers/FlightsController.js";

dotenv.config();
const app = express();

// Database Connection
dbCon();

// Webhook for Stripe
app.post("/webhook", bodyParser.raw({ type: "application/json" }), afterStripe);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// Static Files
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/company", CompanyRoutes);
app.use("/api/user", userRoutes);
app.post("/api/create-checkout-session", stripePayment);
app.get("/api/destinations", realtimeFlightsData);

// Server Listening
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running");
});
