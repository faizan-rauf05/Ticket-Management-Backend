import express from "express";
import {
  getUsers,
  createCategory,
  fetchAllCategories,
  fetchAllTickets,
  fetchAllCompanies,
  deleteUser,
  deleteCompany,
  deleteTicket,
  analytics,
  fetchAllOrders
} from "../controllers/AdminController.js";
import { isAdmin } from "../middleware/verifyToken.js";

const AdminRoutes = express.Router();

AdminRoutes.get("/users", isAdmin, getUsers);
AdminRoutes.post("/category", isAdmin, createCategory);
AdminRoutes.get("/categories", fetchAllCategories);
AdminRoutes.get("/tickets", fetchAllTickets);
AdminRoutes.get("/companies", fetchAllCompanies);
AdminRoutes.get("/orders", fetchAllOrders);
AdminRoutes.get("/analytics", analytics);
AdminRoutes.delete("/company/:id", deleteCompany);
AdminRoutes.delete("/user/:id", deleteUser);
AdminRoutes.delete("/ticket/:id", deleteTicket);

export default AdminRoutes;
