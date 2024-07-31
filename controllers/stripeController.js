import Stripe from "stripe";
const stripe = new Stripe(
  "sk_test_51PhnyARr4CnxscyikkHdwqCZFH9N4BnYGB6SIwgVMqoZgRwFUeIaFKwzbMJkhssfCZQ7qd3oJZ3JiISheJfgJWyk001enpXEy0"
);
let endpointSecret =
  "whsec_57eece98f62694bf5652185dc53a1456142ff079d5093ed4136379bf98e0c7aa";
import { SalesModel } from "../models/salesModel.js";
import { TicketModel } from "../models/ticketModel.js";

export const stripePayment = async (req, res) => {
  const { products, userId } = req.body;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "PKR",
      product_data: {
        name: product.departurePlace,
      },
      unit_amount: Math.round(product.totalPrice * 100),
    },
    quantity: product.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5173/success",
    cancel_url: "http://localhost:5173/cancel",
    metadata: {
      userId: userId,
      products: JSON.stringify(products),
    },
  });

  res.json({ id: session.id });
};

//Web hook

export const afterStripe = async (req, response) => {
  const sig = req.headers["stripe-signature"];
  let event;
  let eventType;
  let data;
  if (endpointSecret) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.object;
    eventType = req.body.type;
  }

  if (eventType === "checkout.session.completed") {
    const session = data;
    const products = JSON.parse(session.metadata.products);
    await updateProductPaymentStatus(products);
  }
};

const updateProductPaymentStatus = async (products) => {
  for (const product of products) {
    try {
      const updatedProduct = await SalesModel.findOneAndUpdate(
        { _id: product._id },
        { $set: { "payment.status": "paid" } },
        { new: true }
      );

      const updatedQuantity = await TicketModel.findOneAndUpdate(
        { _id: product.ticketId },
        {
          $inc: { noOfTickets: -product.quantity },
        },
        { new: true }
      );

      if (updatedQuantity) {
        console.log(`Updated quantity for product ID: ${product._id}`);
      } else {
        console.log(`Product not found with ID: ${product._id}`);
      }

      if (updatedProduct) {
        console.log(
          `Updated product payment status to 'paid' for product ID: ${product._id}`
        );
      } else {
        console.log(`Product not found with ID: ${product._id}`);
      }
    } catch (error) {
      console.error(`Error updating product with ID: ${product.id}`, error);
    }
  }
};
