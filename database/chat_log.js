const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  session_id: {
    type: String,
    trim: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: [true, 'Role is required']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, {
  timestamps: true
});

// Index for user_id
chatLogSchema.index({ user_id: 1 });

module.exports = mongoose.model('ChatLog', chatLogSchema);