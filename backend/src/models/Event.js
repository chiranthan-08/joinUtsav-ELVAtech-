const mongoose = require('mongoose');

const TicketTierSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  totalSeats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  description: { type: String, default: '' },
  perks: [{ type: String }]
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tagline: { type: String, default: '' },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Wedding', 'College Fest', 'Cultural Program', 'Birthday', 'Corporate', 'Concert', 'Religious'] 
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  endDate: { type: String },
  endTime: { type: String },
  venueName: { type: String, required: true },
  venueAddress: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'Rajasthan' },
  organizerId: { type: String, required: true },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, default: '' },
  bannerUrl: { type: String, required: true },
  ticketTiers: [TicketTierSchema],
  dressCode: { type: String, default: 'Festive Indian / Smart Ethnic' },
  highlights: [{ type: String }],
  schedule: [{
    time: { type: String },
    activity: { type: String },
    description: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['approved', 'pending', 'rejected', 'completed'], 
    default: 'approved' 
  },
  isFeatured: { type: Boolean, default: false },
  totalCapacity: { type: Number, default: 500 },
  viewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
