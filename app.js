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
import axios from "axios";

dotenv.config();
const app = express();

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
app.post("/api/create-checkout-session", stripePayment);

const client_id = "JPokEjL3XHNkzIxBDMUEDSjYMsHw0rtZ";
const client_secret = "XWJtBAo4KEDUCYoA";

// Function to get the access token
const getAccessToken = async () => {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: client_id,
        client_secret: client_secret
      }).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw new Error('Failed to get access token');
  }
};

// Endpoint to get destinations
app.get('/api/destinations', async (req, res) => {
  const { origin, maxPrice } = req.query;

  try {
    // Get the access token
    const accessToken = await getAccessToken();

    // Use the access token to get the destinations
    const destinationsResponse = await axios.get(`https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&maxPrice=${maxPrice}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    res.json(destinationsResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server Listening 
app.listen(process.env.PORT, () => {
  console.log("Server is runnning");
});


