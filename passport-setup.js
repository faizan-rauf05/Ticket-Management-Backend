// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import {UserModel} from './models/userModel.js';
// import dotenv from 'dotenv';
// dotenv.config();

// console.log(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET)

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:3000/api/auth/google/callback',
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         const user = await UserModel.findOne({ googleId: profile.id });
//         if (user) {
//           done(null, user);
//         } else {
//           done(null, false, { message: 'User not found in the database' });
//         }
//       } catch (err) {
//         console.error(err);
//         done(err, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await UserModel.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default passport;