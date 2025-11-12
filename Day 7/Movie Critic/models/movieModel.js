const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  releaseYear: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 10 }
});

module.exports = mongoose.model('Movie', movieSchema);
