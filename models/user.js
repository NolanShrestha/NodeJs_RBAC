const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    default: '6757cdffff8f390ea4b2c170',
    required: true
  }
});

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
