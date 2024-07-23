import express from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket} from '../controllers/CompanyController.js';


const CompanyRoutes = express.Router();

CompanyRoutes.post('/ticket', createTicket);
CompanyRoutes.get('/tickets', getTickets);
CompanyRoutes.get('/ticket/:id', getTicketById);
CompanyRoutes.put('/ticket/:id', updateTicket);
CompanyRoutes.delete('/ticket/:id', deleteTicket);
// CompanyRoutes.post('/category',isAdmin, createCategory);
// CompanyRoutes.get('/categories', fetchAllCategories);

export default CompanyRoutes;