const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { getSeedData } = require('./seedData');
const {
  persistCreate,
  persistUpdate,
  persistDelete,
  persistSettings
} = require('../services/mongoSyncService');

const STORE_FILE = path.join(__dirname, 'store.json');

class Store {
  constructor() {
    this.data = null;
    this.init();
  }

  async generateQRCode(passId, eventTitle, userName) {
    try {
      const qrPayload = JSON.stringify({
        platform: 'UtsavMitra',
        passId,
        event: eventTitle,
        guest: userName,
        verified: true,
        generatedAt: new Date().toISOString()
      });
      return await QRCode.toDataURL(qrPayload, {
        color: {
          dark: '#ea580c', // festive saffron
          light: '#ffffff'
        },
        width: 300,
        margin: 2
      });
    } catch (err) {
      console.error('QR generation error:', err);
      return '';
    }
  }

  async init() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        console.log('[Store]: Loaded persisted data from store.json');
      } else {
        console.log('[Store]: Initializing store with rich Indian festival seed data...');
        this.data = getSeedData();
        // Generate QR codes for initial seed bookings
        for (const b of this.data.bookings) {
          if (!b.qrCodeDataUrl) {
            b.qrCodeDataUrl = await this.generateQRCode(b.passId, b.eventTitle, b.userName);
          }
        }
        this.save();
      }
    } catch (err) {
      console.error('[Store Error]: Failed loading store, resetting to seed data', err);
      this.data = getSeedData();
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store Save Error]:', err);
    }
  }

  reset() {
    this.data = getSeedData();
    this.save();
    return this.data;
  }

  // --- Users ---
  getUsers() { return this.data.users; }
  getUserById(id) { return this.data.users.find(u => u._id === id); }
  getUserByEmail(email) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(userData) {
    const newUser = {
      _id: 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    persistCreate('User', newUser);
    return newUser;
  }
  updateUser(id, updates) {
    const idx = this.data.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    persistUpdate('User', id, this.data.users[idx]);
    return this.data.users[idx];
  }
  deleteUser(id) {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u._id !== id);
    this.save();
    persistDelete('User', id);
    return this.data.users.length < initialLen;
  }

  // --- Events ---
  getEvents() { return this.data.events; }
  getEventById(id) { return this.data.events.find(e => e._id === id); }
  createEvent(eventData) {
    const newEvent = {
      _id: 'evt_' + Date.now() + Math.random().toString(36).substring(2, 6),
      status: 'approved', // auto approved for demo convenience
      isFeatured: false,
      viewsCount: 1,
      createdAt: new Date().toISOString(),
      ...eventData
    };
    this.data.events.unshift(newEvent);
    this.save();
    persistCreate('Event', newEvent);
    return newEvent;
  }
  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.data.events[idx] = { ...this.data.events[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    persistUpdate('Event', id, this.data.events[idx]);
    return this.data.events[idx];
  }
  deleteEvent(id) {
    const initialLen = this.data.events.length;
    this.data.events = this.data.events.filter(e => e._id !== id);
    this.save();
    persistDelete('Event', id);
    return this.data.events.length < initialLen;
  }

  // --- Bookings ---
  getBookings() { return this.data.bookings; }
  getBookingById(id) { return this.data.bookings.find(b => b._id === id); }
  getBookingByPassId(passId) { return this.data.bookings.find(b => b.passId.toLowerCase() === passId.trim().toLowerCase()); }
  async createBooking(bookingData) {
    const passId = 'UM-PASS-' + Math.floor(1000 + Math.random() * 9000);
    const qrCodeDataUrl = await this.generateQRCode(passId, bookingData.eventTitle, bookingData.userName);
    const newBooking = {
      _id: 'bkg_' + Date.now() + Math.random().toString(36).substring(2, 6),
      passId,
      paymentStatus: 'paid',
      attendanceStatus: 'pending',
      qrCodeDataUrl,
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    this.data.bookings.unshift(newBooking);

    // Increment bookedSeats on event
    const evt = this.getEventById(bookingData.eventId);
    if (evt && evt.ticketTiers) {
      const tier = evt.ticketTiers.find(t => t.name === bookingData.ticketTier || t.id === bookingData.ticketTierId);
      if (tier) {
        tier.bookedSeats = (tier.bookedSeats || 0) + (bookingData.quantity || 1);
        persistUpdate('Event', evt._id, evt);
      }
    }

    this.save();
    persistCreate('Booking', newBooking);
    return newBooking;
  }
  updateBooking(id, updates) {
    const idx = this.data.bookings.findIndex(b => b._id === id);
    if (idx === -1) return null;
    this.data.bookings[idx] = { ...this.data.bookings[idx], ...updates };
    this.save();
    persistUpdate('Booking', id, this.data.bookings[idx]);
    return this.data.bookings[idx];
  }
  deleteBooking(id) {
    const initialLen = this.data.bookings.length;
    this.data.bookings = this.data.bookings.filter(b => b._id !== id);
    this.save();
    persistDelete('Booking', id);
    return this.data.bookings.length < initialLen;
  }

  // --- Venues ---
  getVenues() { return this.data.venues; }
  getVenueById(id) { return this.data.venues.find(v => v._id === id); }
  createVenue(venueData) {
    const newVenue = {
      _id: 'ven_' + Date.now() + Math.random().toString(36).substring(2, 6),
      rating: 4.8,
      reviewsCount: 1,
      inquiries: [],
      status: 'available',
      createdAt: new Date().toISOString(),
      ...venueData
    };
    this.data.venues.unshift(newVenue);
    this.save();
    persistCreate('Venue', newVenue);
    return newVenue;
  }
  updateVenue(id, updates) {
    const idx = this.data.venues.findIndex(v => v._id === id);
    if (idx === -1) return null;
    this.data.venues[idx] = { ...this.data.venues[idx], ...updates };
    this.save();
    persistUpdate('Venue', id, this.data.venues[idx]);
    return this.data.venues[idx];
  }
  deleteVenue(id) {
    this.data.venues = this.data.venues.filter(v => v._id !== id);
    this.save();
    persistDelete('Venue', id);
    return true;
  }

  // --- Invitations ---
  getInvitations() { return this.data.invitations; }
  getInvitationBySlug(slug) { return this.data.invitations.find(i => i.slug === slug); }
  getInvitationById(id) { return this.data.invitations.find(i => i._id === id); }
  createInvitation(inviteData) {
    const slug = (inviteData.title || 'utsav')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const newInvite = {
      _id: 'inv_' + Date.now() + Math.random().toString(36).substring(2, 6),
      slug,
      rsvpList: [],
      createdAt: new Date().toISOString(),
      ...inviteData
    };
    this.data.invitations.unshift(newInvite);
    this.save();
    persistCreate('Invitation', newInvite);
    return newInvite;
  }
  addRSVP(slugOrId, rsvpData) {
    const invite = this.data.invitations.find(i => i.slug === slugOrId || i._id === slugOrId);
    if (!invite) return null;
    const newRsvp = {
      _id: 'rsvp_' + Date.now(),
      submittedAt: new Date().toISOString(),
      ...rsvpData
    };
    invite.rsvpList = invite.rsvpList || [];
    invite.rsvpList.push(newRsvp);
    this.save();
    persistUpdate('Invitation', invite._id, invite);
    return invite;
  }

  // --- Audit Logs ---
  getAuditLogs() { return this.data.auditLogs; }
  logAction(actor, action, targetType, targetId, details, req) {
    const log = {
      _id: 'aud_' + Date.now() + Math.random().toString(36).substring(2, 5),
      actorId: actor?._id || actor?.id || 'sys_guest',
      actorName: actor?.name || 'Guest User',
      actorRole: actor?.role || 'guest',
      action,
      targetType,
      targetId: String(targetId || ''),
      details: String(details || ''),
      ipAddress: req?.ip || req?.socket?.remoteAddress || '127.0.0.1',
      createdAt: new Date().toISOString()
    };
    this.data.auditLogs.unshift(log);
    // keep max 500 logs
    if (this.data.auditLogs.length > 500) this.data.auditLogs.pop();
    this.save();
    persistCreate('AuditLog', log);
    return log;
  }

  // --- Email Logs (SendGrid) ---
  getEmailLogs() {
    this.data.emailLogs = this.data.emailLogs || [];
    return this.data.emailLogs;
  }
  logEmail(emailRecord) {
    this.data.emailLogs = this.data.emailLogs || [];
    const record = {
      _id: 'eml_' + Date.now() + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      ...emailRecord
    };
    this.data.emailLogs.unshift(record);
    if (this.data.emailLogs.length > 200) this.data.emailLogs.pop();
    this.save();
    persistCreate('EmailLog', record);
    return record;
  }

  // --- System Settings ---
  getSettings() { return this.data.systemSettings; }
  updateSettings(updates) {
    this.data.systemSettings = {
      ...this.data.systemSettings,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    persistSettings(this.data.systemSettings);
    return this.data.systemSettings;
  }

  // --- Login OTPs ---
  storeOTP(email, otp, expiresInMinutes = 10) {
    this.data.otps = this.data.otps || {};
    const normEmail = email.toLowerCase().trim();
    this.data.otps[normEmail] = {
      otp: String(otp).trim(),
      expiresAt: Date.now() + (expiresInMinutes * 60 * 1000),
      attempts: 0
    };
    this.save();
    return this.data.otps[normEmail];
  }

  verifyOTP(email, enteredOtp) {
    this.data.otps = this.data.otps || {};
    const normEmail = email.toLowerCase().trim();
    const record = this.data.otps[normEmail];

    if (!record) {
      return { success: false, message: 'No active OTP request found for this email. Please request a new code.' };
    }

    if (Date.now() > record.expiresAt) {
      delete this.data.otps[normEmail];
      this.save();
      return { success: false, message: 'This OTP code has expired. Please request a new code.' };
    }

    if (record.attempts >= 5) {
      delete this.data.otps[normEmail];
      this.save();
      return { success: false, message: 'Too many incorrect attempts. Please request a new code.' };
    }

    if (record.otp !== String(enteredOtp).trim()) {
      record.attempts += 1;
      this.save();
      return { success: false, message: `Incorrect verification code. (${5 - record.attempts} attempts remaining)` };
    }

    // OTP verified successfully -> clear it
    delete this.data.otps[normEmail];
    this.save();
    return { success: true };
  }
}

const storeInstance = new Store();
module.exports = storeInstance;

