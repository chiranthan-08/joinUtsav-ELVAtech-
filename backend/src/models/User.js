const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['user', 'organizer', 'admin', 'super_admin'], 
    default: 'user' 
  },
  phone: { type: String, default: '+91 98765 43210' },
  city: { type: String, default: 'Jaipur' },
  organization: { type: String, default: '' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

