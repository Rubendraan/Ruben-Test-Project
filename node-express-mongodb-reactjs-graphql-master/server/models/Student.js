var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  id: String,
  studentID: String,
  name: String,
  course: String,
  address: String,
  age: { type: Number, min: 15, max: 30 },
  hobby: String,
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Student', BookSchema);