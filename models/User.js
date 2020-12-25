const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

//Methods
userSchema.methods.generateHash = (password) => bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = function (password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('user', userSchema);