const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: true,
    trim: true
  },
  country: {
    type: String,
    default: 'Kenya'
  },
  logo_url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for name (unique handled by unique: true)
brandSchema.index({ name: 1 });

module.exports = mongoose.model('Brand', brandSchema);