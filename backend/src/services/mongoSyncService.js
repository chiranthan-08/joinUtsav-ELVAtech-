const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Invitation = require('../models/Invitation');
const { AuditLog, SystemSetting } = require('../models/AuditLog');
const EmailLog = require('../models/EmailLog');
const { getMongoStatus } = require('../config/db');

const models = {
  User,
  Event,
  Booking,
  Venue,
  Invitation,
  AuditLog,
  EmailLog,
  SystemSetting
};

/**
 * Synchronize all entities on startup:
 * If MongoDB collections are empty, seeds them with existing records.
 * If MongoDB collections contain data, hydrates the in-memory cache with the latest Atlas records.
 */
async function syncOnStartup(store) {
  if (!getMongoStatus()) return;

  try {
    console.log('🍃 [MongoDB Sync]: Initiating full synchronization with MongoDB Atlas...');

    // 1. Users
    const userCount = await User.countDocuments();
    if (userCount === 0 && store.data.users && store.data.users.length) {
      for (const u of store.data.users) {
        await User.findOneAndUpdate({ _id: u._id }, { $set: u }, { upsert: true, new: true });
      }
      console.log(`  ✔ Users: Seeded ${store.data.users.length} records into MongoDB Atlas`);
    } else if (userCount > 0) {
      const dbUsers = await User.find().lean();
      store.data.users = dbUsers;
      console.log(`  ✔ Users: Hydrated ${dbUsers.length} live records from MongoDB Atlas`);
    }

    // 2. Events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0 && store.data.events && store.data.events.length) {
      for (const e of store.data.events) {
        await Event.findOneAndUpdate({ _id: e._id }, { $set: e }, { upsert: true, new: true });
      }
      console.log(`  ✔ Events: Seeded ${store.data.events.length} celebrations into MongoDB Atlas`);
    } else if (eventCount > 0) {
      const dbEvents = await Event.find().lean();
      store.data.events = dbEvents;
      console.log(`  ✔ Events: Hydrated ${dbEvents.length} celebrations from MongoDB Atlas`);
    }

    // 3. Bookings
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0 && store.data.bookings && store.data.bookings.length) {
      for (const b of store.data.bookings) {
        await Booking.findOneAndUpdate({ _id: b._id }, { $set: b }, { upsert: true, new: true });
      }
      console.log(`  ✔ Bookings: Seeded ${store.data.bookings.length} reservations into MongoDB Atlas`);
    } else if (bookingCount > 0) {
      const dbBookings = await Booking.find().lean();
      store.data.bookings = dbBookings;
      console.log(`  ✔ Bookings: Hydrated ${dbBookings.length} reservations from MongoDB Atlas`);
    }

    // 4. Venues
    const venueCount = await Venue.countDocuments();
    if (venueCount === 0 && store.data.venues && store.data.venues.length) {
      for (const v of store.data.venues) {
        await Venue.findOneAndUpdate({ _id: v._id }, { $set: v }, { upsert: true, new: true });
      }
      console.log(`  ✔ Venues: Seeded ${store.data.venues.length} venues into MongoDB Atlas`);
    } else if (venueCount > 0) {
      const dbVenues = await Venue.find().lean();
      store.data.venues = dbVenues;
      console.log(`  ✔ Venues: Hydrated ${dbVenues.length} venues from MongoDB Atlas`);
    }

    // 5. Invitations
    const inviteCount = await Invitation.countDocuments();
    if (inviteCount === 0 && store.data.invitations && store.data.invitations.length) {
      for (const inv of store.data.invitations) {
        await Invitation.findOneAndUpdate({ _id: inv._id }, { $set: inv }, { upsert: true, new: true });
      }
      console.log(`  ✔ Invitations: Seeded ${store.data.invitations.length} invitation cards into MongoDB Atlas`);
    } else if (inviteCount > 0) {
      const dbInvites = await Invitation.find().lean();
      store.data.invitations = dbInvites;
      console.log(`  ✔ Invitations: Hydrated ${dbInvites.length} cards from MongoDB Atlas`);
    }

    // 6. Audit Logs
    const logCount = await AuditLog.countDocuments();
    if (logCount === 0 && store.data.auditLogs && store.data.auditLogs.length) {
      for (const log of store.data.auditLogs) {
        await AuditLog.findOneAndUpdate({ _id: log._id }, { $set: log }, { upsert: true, new: true });
      }
      console.log(`  ✔ Audit Logs: Seeded ${store.data.auditLogs.length} audit trails into MongoDB Atlas`);
    } else if (logCount > 0) {
      const dbLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(100).lean();
      store.data.auditLogs = dbLogs;
      console.log(`  ✔ Audit Logs: Hydrated ${dbLogs.length} audit logs from MongoDB Atlas`);
    }

    // 7. Email Logs
    const emailCount = await EmailLog.countDocuments();
    if (emailCount === 0 && store.data.emailLogs && store.data.emailLogs.length) {
      for (const eml of store.data.emailLogs) {
        await EmailLog.findOneAndUpdate({ _id: eml._id }, { $set: eml }, { upsert: true, new: true });
      }
      console.log(`  ✔ Email Logs: Seeded ${store.data.emailLogs.length} email records into MongoDB Atlas`);
    } else if (emailCount > 0) {
      const dbEmails = await EmailLog.find().sort({ createdAt: -1 }).limit(100).lean();
      store.data.emailLogs = dbEmails;
      console.log(`  ✔ Email Logs: Hydrated ${dbEmails.length} email logs from MongoDB Atlas`);
    }

    // 8. System Settings
    const settingCount = await SystemSetting.countDocuments();
    if (settingCount === 0 && store.data.systemSettings) {
      await SystemSetting.findOneAndUpdate(
        { _id: 'global_system_settings' },
        { $set: { _id: 'global_system_settings', ...store.data.systemSettings } },
        { upsert: true, new: true }
      );
      console.log(`  ✔ System Settings: Initialized platform configurations in MongoDB Atlas`);
    } else if (settingCount > 0) {
      const dbSetting = await SystemSetting.findOne().lean();
      if (dbSetting) {
        const { _id, ...cleanSettings } = dbSetting;
        store.data.systemSettings = cleanSettings;
      }
    }

    // Persist local store.json backup
    store.save();
    console.log('🎉 [MongoDB Atlas]: All data is synchronized and actively storing in your MongoDB account!');
  } catch (err) {
    console.error('❌ [MongoDB Sync Error]:', err.message);
  }
}

/**
 * Real-time write-through persistence helpers.
 * Called automatically on every create / update / delete.
 */
function persistCreate(modelName, doc) {
  if (!getMongoStatus()) return;
  const Model = models[modelName];
  if (!Model) return;

  Model.findOneAndUpdate({ _id: doc._id }, { $set: doc }, { upsert: true, new: true }).catch(err => {
    console.error(`[MongoDB Persist Error - ${modelName} Create]:`, err.message);
  });
}

function persistUpdate(modelName, id, updates) {
  if (!getMongoStatus()) return;
  const Model = models[modelName];
  if (!Model) return;

  Model.findOneAndUpdate({ _id: id }, { $set: updates }, { upsert: true, new: true }).catch(err => {
    console.error(`[MongoDB Persist Error - ${modelName} Update]:`, err.message);
  });
}

function persistDelete(modelName, id) {
  if (!getMongoStatus()) return;
  const Model = models[modelName];
  if (!Model) return;

  Model.deleteOne({ _id: id }).catch(err => {
    console.error(`[MongoDB Persist Error - ${modelName} Delete]:`, err.message);
  });
}

function persistSettings(updates) {
  if (!getMongoStatus()) return;
  SystemSetting.findOneAndUpdate(
    { _id: 'global_system_settings' },
    { $set: updates },
    { upsert: true, new: true }
  ).catch(err => {
    console.error(`[MongoDB Persist Error - System Settings]:`, err.message);
  });
}

module.exports = {
  syncOnStartup,
  persistCreate,
  persistUpdate,
  persistDelete,
  persistSettings
};

