const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  joined_date: {
    type: Date,
    default: Date.now
  },
  verification_code: {
    type: String,
    required: true
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    required: false,
    default: ""
  },
  city: {
    type: String,
    required: false,
    default: ""
  },
  mobile: {
    type: String,
    required: false,
    default: ""
  },
  website: {
    type: String,
    required: false,
    default: ""
  },
  linkedin_url: {
    type: String,
    required: false,
    default: ""
  }
});


const User = mongoose.model('User', UserSchema);

module.exports = User;