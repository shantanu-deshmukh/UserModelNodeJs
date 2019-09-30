const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../utils/auth');
const User = require('../models/User');

// Home
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Profile
router.get('/profile', ensureAuthenticated, (req, res) =>
  res.render('profile', {
    user: req.user
  })
);

//Edit Profile View
router.get('/profile/edit', ensureAuthenticated, (req, res) =>
  res.render('editprofile', {
    user: req.user
  })
);

//Edit Profile Handler
router.post('/profile/edit', ensureAuthenticated, (req, res) => {
  const { name, email, bio, mobile, city, website, linkedin_url } = req.body;
  let errors = [];

  if (!name) {
    errors.push({ msg: 'Please enter name' });

  }

  if (!email) {
    errors.push({ msg: 'Please enter email' });
  }


  if (errors.length > 0) {
    res.render('profile', {
      errors,
      user: req.user
    });
  } else {

    User.findOneAndUpdate({ email: email }, { $set: { name, bio, mobile, city, website, linkedin_url } }, { new: false }, (err, doc) => {
      if (err) {
        req.flash(
          'error_msg',
          'Unable to update'
        );
        res.redirect('/profile');

      } else {
        req.flash(
          'success_msg',
          'Profile Updated'
        );
        res.redirect('/profile');
      }

    });

  }

});

module.exports = router;