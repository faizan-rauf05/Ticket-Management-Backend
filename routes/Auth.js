import express from 'express';
import { register, login, logout, companyrRegister } from '../controllers/AuthController.js';
const AuthRoutes = express.Router();

AuthRoutes.post('/register', register);
AuthRoutes.post('/company-register', companyrRegister);
AuthRoutes.post('/login', login);
AuthRoutes.post('/logout', logout);

export default AuthRoutes;