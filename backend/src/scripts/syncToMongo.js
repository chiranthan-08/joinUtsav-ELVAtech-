const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });
dotenv.config();

const store = require('../data/inMemoryStore');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Venue = require('../models/Venue');
const Invitation = require('../models/Invitation');
const { AuditLog, SystemSetting } = require('../models/AuditLog');
const EmailLog = require('../models/EmailLog');

async function runMigration() {
  const uri = process.env.MONGO_URI;

  console.log(`====================================================`);
  console.log(`  🍃 UtsavMitra MongoDB Atlas Migration Utility 🍃  `);
  console.log(`====================================================`);

  if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
    console.log(`[Target URI]: ${uri || 'Not configured'}`);
    console.log(`⚠️  Warning: MONGO_URI is pointing to localhost or is empty.`);
    console.log(`   To store your data in your MongoDB Atlas cloud account:`);
    console.log(`   1. Open backend/.env`);
    console.log(`   2. Set MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/utsavmitra?retryWrites=true&w=majority`);
    console.log(`   3. Re-run: npm run sync:mongo --prefix backend\n`);
  } else {
    console.log(`[Target URI]: ${uri.replace(/:([^:@]+)@/, ':****@')}`);
  }

  try {
    console.log(`[Connecting] Establishing connection to MongoDB cluster...`);
    const conn = await mongoose.connect(uri || 'mongodb://localhost:27017/utsavmitra', {
      serverSelectionTimeoutMS: 12000
    });

    console.log(`✅ [Connected]: Host: ${conn.connection.host}`);
    console.log(`📂 [Database]: ${conn.connection.name}`);
    console.log(`----------------------------------------------------`);
    console.log(`Pushing all application records into your MongoDB account...`);

    // 1. Users
    let usersCount = 0;
    for (const u of (store.data.users || [])) {
      await User.findOneAndUpdate({ _id: u._id }, { $set: u }, { upsert: true, new: true });
      usersCount++;
    }
    console.log(`  ✔ Users migrated:        ${usersCount}`);

    // 2. Events
    let eventsCount = 0;
    for (const e of (store.data.events || [])) {
      await Event.findOneAndUpdate({ _id: e._id }, { $set: e }, { upsert: true, new: true });
      eventsCount++;
    }
    console.log(`  ✔ Events migrated:       ${eventsCount}`);

    // 3. Bookings
    let bookingsCount = 0;
    for (const b of (store.data.bookings || [])) {
      await Booking.findOneAndUpdate({ _id: b._id }, { $set: b }, { upsert: true, new: true });
      bookingsCount++;
    }
    console.log(`  ✔ Bookings migrated:     ${bookingsCount}`);

    // 4. Venues
    let venuesCount = 0;
    for (const v of (store.data.venues || [])) {
      await Venue.findOneAndUpdate({ _id: v._id }, { $set: v }, { upsert: true, new: true });
      venuesCount++;
    }
    console.log(`  ✔ Venues migrated:       ${venuesCount}`);

    // 5. Invitations
    let invitesCount = 0;
    for (const inv of (store.data.invitations || [])) {
      await Invitation.findOneAndUpdate({ _id: inv._id }, { $set: inv }, { upsert: true, new: true });
      invitesCount++;
    }
    console.log(`  ✔ Invitations migrated:  ${invitesCount}`);

    // 6. Audit Logs
    let logsCount = 0;
    for (const l of (store.data.auditLogs || [])) {
      await AuditLog.findOneAndUpdate({ _id: l._id }, { $set: l }, { upsert: true, new: true });
      logsCount++;
    }
    console.log(`  ✔ Audit Logs migrated:   ${logsCount}`);

    // 7. Email Logs
    let emailsCount = 0;
    for (const eml of (store.data.emailLogs || [])) {
      await EmailLog.findOneAndUpdate({ _id: eml._id }, { $set: eml }, { upsert: true, new: true });
      emailsCount++;
    }
    console.log(`  ✔ Email Logs migrated:   ${emailsCount}`);

    // 8. System Settings
    if (store.data.systemSettings) {
      await SystemSetting.findOneAndUpdate(
        { _id: 'global_system_settings' },
        { $set: { _id: 'global_system_settings', ...store.data.systemSettings } },
        { upsert: true, new: true }
      );
      console.log(`  ✔ System Settings:       Configured`);
    }

    console.log(`====================================================`);
    console.log(`🎉 SUCCESS! Every piece of data is now saved into`);
    console.log(`   your MongoDB Atlas cluster: "${conn.connection.name}".`);
    console.log(`====================================================`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(`\n❌ [Migration Failed]: ${err.message}`);
    console.log(`\nTroubleshooting:`);
    console.log(`  1. Open MongoDB Atlas -> Network Access -> Ensure 0.0.0.0/0 (Allow Anywhere) is added.`);
    console.log(`  2. Open MongoDB Atlas -> Database Access -> Ensure user has read/write permissions.`);
    console.log(`  3. Ensure your username and password are correctly entered in backend/.env.`);
    process.exit(1);
  }
}

runMigration();

