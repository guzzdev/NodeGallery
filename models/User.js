const mongoose = require('mongoose');
// eslint-disable-next-line quotes
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});
// Methods
UserSchema.methods.generateHash = (password) => bcrypt.hashSync(password, 10);

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
