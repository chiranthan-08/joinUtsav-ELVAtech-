const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  _id: { type: String },
  passId: { type: String, required: true, unique: true }, // e.g. "UM-PASS-8839"
  eventId: { type: String, required: true },
  eventTitle: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventVenue: { type: String, default: '' },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, default: '' },
  ticketTier: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['paid', 'pending', 'failed', 'refunded'], 
    default: 'paid' 
  },
  paymentMethod: { type: String, default: 'razorpay' },
  razorpayPaymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  qrCodeDataUrl: { type: String, default: '' },
  attendanceStatus: { 
    type: String, 
    enum: ['pending', 'checked_in'], 
    default: 'pending' 
  },
  checkedInAt: { type: Date },
  checkedInBy: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { strict: false, timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

