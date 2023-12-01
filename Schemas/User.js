const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  FirstName : {
    type: String,
    required: true
  },

  LastName : {
    type: String,
    required: true
  },

  Email : {
    type: String,
    required: true
  },

  Password : {
    type: String,
    required: true
  },

  DOB : {
    type: String
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

