const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');



const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));
// router.get('/mentorlogin', forwardAuthenticated, (req, res) => res.render('mentorlogin'));


// Register Page
router.get('/signup', forwardAuthenticated, (req, res) => res.render('signup'));
// router.get('/mentorsignup', forwardAuthenticated, (req, res) => res.render('mentorsignup'));

// Register
router.post('/signup', (req, res) => {
  const { fname, lname, email, password, password2 } = req.body;
  let errors = [];

  if (!fname || !lname || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('signup', {
      errors,
      fname,
      lname,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('signup', {
          errors,
          fname,
          lname,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          fname,
          lname,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Logins
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

// router.get('/pay', (req, res) => {
//   req.dashboard();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/paystack/pay');
// });

module.exports = router;
