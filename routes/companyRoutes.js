import express from 'express';
import { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, updateCompanyProfile, updateCompanyPassword} from '../controllers/CompanyController.js';


const CompanyRoutes = express.Router();

CompanyRoutes.post('/ticket', createTicket);
CompanyRoutes.get('/tickets/:id', getTickets);
CompanyRoutes.get('/ticket/:id', getTicketById);
CompanyRoutes.put('/ticket/:id', updateTicket);
CompanyRoutes.delete('/ticket/:id/:companyId', deleteTicket);
CompanyRoutes.put('/profile/:id', updateCompanyProfile);
CompanyRoutes.put('/profile/password/:id', updateCompanyPassword);

export default CompanyRoutes;