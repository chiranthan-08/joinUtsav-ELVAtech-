const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hostName: { type: String, required: true },
  eventType: { type: String, required: true }, // Wedding, Sangeet, Birthday, Griha Pravesh, Annaprashan, College Reunion
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  venue: { type: String, required: true },
  theme: { 
    type: String, 
    enum: ['royal-marigold', 'rajasthani-regal', 'modern-glow', 'bollywood-bash', 'college-neon'], 
    default: 'royal-marigold' 
  },
  coverImage: { type: String, default: '' },
  customMessage: { type: String, default: '' },
  musicUrl: { type: String, default: '' },
  rsvpList: [{
    guestName: { type: String, required: true },
    guestPhone: { type: String },
    guestsCount: { type: Number, default: 1 },
    status: { type: String, enum: ['attending', 'declined', 'tentative'], default: 'attending' },
    message: { type: String, default: '' },
    dietaryNotes: { type: String, default: '' },
    submittedAt: { type: Date, default: Date.now }
  }],
  slug: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Invitation || mongoose.model('Invitation', InvitationSchema);

