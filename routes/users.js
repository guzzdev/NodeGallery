const express = require('express');

const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => {
  res.render('home.ejs', { name: req.user.username });
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })(req, res, next);
});

// Register
router.post('/register', (req, res) => {
  const { username, password, password2 } = req.body;
  const errors = [];

  if (!username || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      password,
      password2,
    });
  } else {
    User.findOne({ username }).then((user) => {
      if (user) {
        errors.push({ msg: 'username already exists' });
        res.render('register', {
          errors,
          username,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          username,
          password,
        });

        bcrypt.genSalt(10, (errGen, salt) => {
          bcrypt.hash(newUser.password, salt, (errHash, hash) => {
            if (errHash) throw errHash;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in',
                );
                res.redirect('/auth/login');
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});
module.exports = router;
