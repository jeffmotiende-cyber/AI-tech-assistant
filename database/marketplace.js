const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Marketplace name is required'],
    unique: true,
    trim: true
  },
  base_url: {
    type: String,
    required: [true, 'Base URL is required'],
    trim: true
  },
  api_key: {
    type: String,
    trim: true
  },
  supported_categories: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for name (unique handled by unique: true)
marketplaceSchema.index({ name: 1 });

module.exports = mongoose.model('Marketplace', marketplaceSchema);