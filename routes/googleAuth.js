// routes/auth.js
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' ,successRedirect:'http://localhost:5173/user' }), (req, res) => {
  if (req.user) {
    const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Set token in cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
    // res.json({ role: req.user.role });
  } else {
    console.log("User not found");
  }
});

// router.get('/logout', (req, res) => {
//   req.logout();
//   res.clearCookie('token');
// });

export default router;
