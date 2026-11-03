const os = require('os');
const bcrypt = require('bcryptjs');
const store = require('../data/inMemoryStore');
const { getMongoStatus } = require('../config/db');

exports.getSuperAdminOverview = async (req, res) => {
  try {
    const allEvents = store.getEvents();
    const allBookings = store.getBookings();
    const allUsers = store.getUsers();
    const allVenues = store.getVenues();
    const allInvitations = store.getInvitations();
    const allAuditLogs = store.getAuditLogs();
    const settings = store.getSettings();

    // Segregate by roles
    const regularUsers = allUsers.filter(u => u.role === 'user');
    const organizers = allUsers.filter(u => u.role === 'organizer');
    const admins = allUsers.filter(u => u.role === 'admin');
    const superAdmins = allUsers.filter(u => u.role === 'super_admin');

    const totalTicketsSold = allBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const grossMerchandiseValue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const platformFeeRate = (settings.platformFeePercent || 5) / 100;
    const platformCommissionRevenue = Math.round(grossMerchandiseValue * platformFeeRate);
    const organizerPayoutsTotal = grossMerchandiseValue - platformCommissionRevenue;

    const checkedInCount = allBookings.filter(b => b.attendanceStatus === 'checked_in').length;

    // Server & DB diagnostics
    const systemHealth = {
      databaseStatus: getMongoStatus() ? 'MongoDB Cluster Connected (Active)' : 'Persistent Embedded JSON Engine (Active)',
      serverUptimeSeconds: Math.round(process.uptime()),
      systemMemoryTotalMB: Math.round(os.totalmem() / 1024 / 1024),
      systemMemoryFreeMB: Math.round(os.freemem() / 1024 / 1024),
      processMemoryRSSMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
      nodeVersion: process.version,
      platform: `${os.type()} ${os.release()} (${os.arch()})`,
      activeEntitiesCount: {
        events: allEvents.length,
        bookings: allBookings.length,
        users: allUsers.length,
        venues: allVenues.length,
        invitations: allInvitations.length,
        auditLogs: allAuditLogs.length
      }
    };

    return res.status(200).json({
      success: true,
      data: {
        // Master financials
        financials: {
          grossMerchandiseValue,
          platformCommissionRevenue,
          organizerPayoutsTotal,
          platformFeePercent: settings.platformFeePercent || 5,
          totalTransactions: allBookings.length,
          successfulPayments: allBookings.filter(b => b.paymentStatus === 'paid').length
        },
        // Admin information (explicitly included)
        adminsList: admins.map(({ password, ...a }) => a),
        superAdminsList: superAdmins.map(({ password, ...sa }) => sa),
        allAdminsCombined: [...superAdmins, ...admins].map(({ password, ...a }) => a),
        // All platform data from Admin interface
        allEvents,
        allBookings,
        allUsers: allUsers.map(({ password, ...u }) => u),
        allVenues,
        allInvitations,
        // System and logs
        auditLogs: allAuditLogs.slice(0, 50),
        allEmailLogs: store.getEmailLogs(),
        systemHealth,
        settings,
        metrics: {
          totalEvents: allEvents.length,
          totalTicketsSold,
          checkedInCount,
          totalUsers: regularUsers.length,
          totalOrganizers: organizers.length,
          totalAdmins: admins.length,
          totalSuperAdmins: superAdmins.length,
          totalVenues: allVenues.length
        }
      }
    });
  } catch (error) {
    console.error('getSuperAdminOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve super admin overview.' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, city, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = store.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newAdmin = store.createUser({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      phone: phone || '+91 98110 00000',
      city: city || 'New Delhi',
      organization: department || 'UtsavMitra Regional Admin Team'
    });

    store.logAction(
      req.user,
      'ADMIN_CREATED',
      'USER',
      newAdmin._id,
      `Super Admin created new Administrator: ${newAdmin.name} (${newAdmin.email})`,
      req
    );

    const { password: _, ...adminClean } = newAdmin;
    return res.status(201).json({
      success: true,
      message: 'New Admin created successfully!',
      admin: adminClean
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create new admin.' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // 'user', 'organizer', 'admin', 'super_admin'

    if (!['user', 'organizer', 'admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid target role.' });
    }

    const targetUser = store.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protect self demotion
    if (targetUser._id === req.user._id && role !== 'super_admin') {
      return res.status(400).json({ success: false, message: 'You cannot demote your own Super Admin account.' });
    }

    const previousRole = targetUser.role;
    const updated = store.updateUser(id, { role });

    store.logAction(
      req.user,
      'ROLE_CHANGED',
      'USER',
      id,
      `Changed ${targetUser.name}'s role from ${previousRole} to ${role}`,
      req
    );

    const { password: _, ...userClean } = updated;
    return res.status(200).json({
      success: true,
      message: `User role successfully updated to '${role}'.`,
      user: userClean
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user role.' });
  }
};

exports.updateGlobalSettings = async (req, res) => {
  try {
    const { platformFeePercent, razorpayTestMode, autoApproveEvents, supportEmail, emergencyHelpline, maintenanceMode } = req.body;

    const updated = store.updateSettings({
      ...(platformFeePercent !== undefined && { platformFeePercent: Number(platformFeePercent) }),
      ...(razorpayTestMode !== undefined && { razorpayTestMode: Boolean(razorpayTestMode) }),
      ...(autoApproveEvents !== undefined && { autoApproveEvents: Boolean(autoApproveEvents) }),
      ...(supportEmail && { supportEmail }),
      ...(emergencyHelpline && { emergencyHelpline }),
      ...(maintenanceMode !== undefined && { maintenanceMode: Boolean(maintenanceMode) }),
      updatedBy: req.user.name
    });

    store.logAction(
      req.user,
      'GLOBAL_SETTINGS_UPDATED',
      'SYSTEM',
      'settings',
      `Super Admin updated platform settings. Fee: ${updated.platformFeePercent}%, TestMode: ${updated.razorpayTestMode}`,
      req
    );

    return res.status(200).json({
      success: true,
      message: 'Platform settings saved successfully!',
      settings: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update system settings.' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const logs = store.getAuditLogs();
    return res.status(200).json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
};

exports.resetToSeedData = async (req, res) => {
  try {
    const freshData = store.reset();
    store.logAction(
      req.user,
      'DATA_RESET_TO_SEED',
      'SYSTEM',
      'store',
      'Super Admin reset all platform data to seed baseline.',
      req
    );

    return res.status(200).json({
      success: true,
      message: 'Platform database reseeded to pristine demo state with events, bookings, and users.',
      counts: {
        users: freshData.users.length,
        events: freshData.events.length,
        bookings: freshData.bookings.length,
        venues: freshData.venues.length
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to reset seed data.' });
  }
};

