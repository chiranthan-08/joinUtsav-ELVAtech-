const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Rajasthan' },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['Palace / Heritage', 'Banquet Hall', 'Lawn / Resort', 'Auditorium', 'Club / Rooftop'], 
    default: 'Banquet Hall' 
  },
  amenities: [{ type: String }],
  images: [{ type: String }],
  contactPerson: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  reviewsCount: { type: Number, default: 42 },
  description: { type: String, default: '' },
  inquiries: [{
    userName: String,
    userEmail: String,
    userPhone: String,
    eventType: String,
    eventDate: String,
    guestsCount: Number,
    message: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['available', 'booked', 'maintenance'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Venue || mongoose.model('Venue', VenueSchema);
