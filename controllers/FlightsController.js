import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

// Function to get the access token
const getAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.FLIGHTS_CLIENT_ID,
        client_secret: process.env.FLIGHTS_CLIENTS_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error.message);
    throw new Error("Failed to get access token");
  }
};

export const realtimeFlightsData = async (req, res) => {
  let { origin, maxPrice } = req.query;

  origin = "PAR";

  if (!origin || !maxPrice) {
    return res
      .status(404)
      .json({ success: false, message: "Pleasy fill all fields" });
  }

  try {
    // Get the access token
    const accessToken = await getAccessToken();

    // Use the access token to get the destinations
    const destinationsResponse = await axios.get(
      `https://test.api.amadeus.com/v1/shopping/flight-destinations?origin=${origin}&maxPrice=${maxPrice}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json(destinationsResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
