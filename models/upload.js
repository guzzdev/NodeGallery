const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  imagename: String,
  date: { type: Date, default: Date.now },
  author: { type: String, default: 'Anonymous' },
});

module.exports = mongoose.model('image', uploadSchema);

