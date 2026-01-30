const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'Brand is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  price_kes: {
    type: Number,
    required: [true, 'Price in KES is required'],
    min: [0, 'Price must be positive']
  },
  specifications: {
    power_voltage: {
      type: String,
      trim: true
    },
    power_frequency: {
      type: String,
      trim: true
    },
    warranty: {
      type: String,
      trim: true
    },
    features: [{
      type: String,
      trim: true
    }]
  },
  marketplaces: [{
    platform: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Marketplace'
    },
    url: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      min: [0, 'Price must be positive']
    },
    availability: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
});

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'specifications.power_voltage': 1 });
productSchema.index({ price_kes: 1 });

module.exports = mongoose.model('Product', productSchema);