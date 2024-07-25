import express from 'express';
import { getTickets ,getTicketDetails, addItemsToCart, getCartItems, deleteItemFromCart} from '../controllers/userController.js';


const userRoutes = express.Router();

// CompanyRoutes.post('/ticket', createTicket);
userRoutes.get('/tickets', getTickets);
userRoutes.get('/ticket-details/:id', getTicketDetails);
userRoutes.post('/cart', addItemsToCart);
userRoutes.get('/cart/:id', getCartItems);
userRoutes.delete('/cart/item/:id/:userId', deleteItemFromCart);

export default userRoutes;