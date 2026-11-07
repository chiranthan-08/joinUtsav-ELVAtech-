const mongoose = require('mongoose');

const EmailLogSchema = new mongoose.Schema({
  _id: { type: String },
  to: { type: String, required: true },
  subject: { type: String, required: true },
  provider: { type: String, default: 'gmail_smtp' },
  status: { type: String, enum: ['sent', 'failed', 'simulated'], default: 'sent' },
  messageId: { type: String },
  template: { type: String },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

module.exports = mongoose.models.EmailLog || mongoose.model('EmailLog', EmailLogSchema);

