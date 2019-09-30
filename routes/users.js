const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const { forwardAuthenticated } = require('../utils/auth');
const generateVerificationID = require('../utils/util-functions');
const sendVerificationEmail = require('../utils/email-util');


// Login Page View
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Login Page Handler
router.post('/login', (req, res, next) => {

  if(req.body.remember){
      req.session.cookie.expires = false; // Session doesn't expire untill the user clicks logout
  }else{
    req.session.cookie.maxAge = 15 * 60 * 1000; // Session expires in 15 mins
  }
  
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


// Register Page View
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register Handler
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  
  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {

    User.findOne({ email: email }).then(user => {
      
      if (user) {
        //user already exists
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        //create new user
        var verification_code = generateVerificationID(6);
        const newUser = new User({
          name,
          email,
          password,
          verification_code
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                
                sendVerificationEmail(req.headers.host, newUser.name, newUser.email, verification_code, function(result, err){
                    if(err){
                      req.flash(
                        'error_msg',
                        'Unable to send verification email'
                      );
                      console.log("ERROR" + err)
                      res.redirect('/users/login');
                    }else{
                      req.flash(
                        'success_msg',
                        'Registration Successfull, please login'
                      );
                      res.redirect('/users/login');
                    }

                });


              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Logout Handler
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Logged out!');
  res.redirect('/users/login');
});

// Verify Email Handler
router.get('/verify', (req, res) => {
  const email = req.query.email
  const vcode = req.query.code;

  User.findOne({ email: email }).then(user => {
    if (!user) {
      //user doesn't exists
      req.flash(
        'error_msg',
        "User doesn't exists"
      );
      res.redirect('/users/register');

    }else if(user.is_verified){

      req.flash(
        'error_msg',
        "User Already Verified"
      );
      res.redirect('/users/register');

    }else if(user.verification_code == vcode){
      user.is_verified = true
      user.save()
      req.flash('success_msg', 'Email Verified successfully');
      res.redirect('/users/login');
    }else{
      req.flash(
        'error_msg',
        "Invalid verification code"
      );
      res.redirect('/users/register');

    }
  });
});


module.exports = router;
