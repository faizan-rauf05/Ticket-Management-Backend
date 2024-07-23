import express from 'express';
import { getUsers ,createCategory, fetchAllCategories } from '../controllers/AdminController.js';
import {isAdmin} from "../middleware/verifyToken.js";


const AdminRoutes = express.Router();

AdminRoutes.get('/users',isAdmin, getUsers);
AdminRoutes.post('/category',isAdmin, createCategory);
AdminRoutes.get('/categories', fetchAllCategories);

export default AdminRoutes;