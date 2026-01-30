const mongoose = require('mongoose');

const powerSpecSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  standardVoltage: {
    type: String,
    required: [true, 'Standard voltage is required'],
    trim: true
  },
  standardWattage: {
    type: String,
    trim: true
  },
  compatibilityNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for category
powerSpecSchema.index({ category: 1 });

module.exports = mongoose.model('PowerSpec', powerSpecSchema);