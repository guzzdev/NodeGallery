const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  imagename: String,
});

module.exports = mongoose.model('image', uploadSchema);
