const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  actorId: { type: String, required: true },
  actorName: { type: String, required: true },
  actorRole: { type: String, required: true },
  action: { type: String, required: true }, // e.g. "EVENT_APPROVED", "ADMIN_CREATED", "QR_PASS_CHECKED_IN", "VENUE_UPDATED"
  targetType: { type: String, required: true }, // "EVENT", "USER", "BOOKING", "VENUE", "SYSTEM"
  targetId: { type: String, default: '' },
  details: { type: String, default: '' },
  ipAddress: { type: String, default: '127.0.0.1' },
  createdAt: { type: Date, default: Date.now }
});

const SystemSettingSchema = new mongoose.Schema({
  platformName: { type: String, default: 'UtsavMitra' },
  platformFeePercent: { type: Number, default: 5 }, // 5% platform commission
  razorpayTestMode: { type: Boolean, default: true },
  autoApproveEvents: { type: Boolean, default: false },
  supportEmail: { type: String, default: 'support@utsavmitra.in' },
  emergencyHelpline: { type: String, default: '+91 1800 200 8822' },
  maintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: 'superadmin' }
});

const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
const SystemSetting = mongoose.models.SystemSetting || mongoose.model('SystemSetting', SystemSettingSchema);

module.exports = { AuditLog, SystemSetting };

