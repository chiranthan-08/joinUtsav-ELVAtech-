const store = require('../data/inMemoryStore');
const { sendEmail } = require('../services/emailService');

// Admin has access to EVERY platform event, booking, user, organizer, and venue
exports.getAdminOverview = async (req, res) => {
  try {
    const allEvents = store.getEvents();
    const allBookings = store.getBookings();
    const allUsers = store.getUsers();
    const allVenues = store.getVenues();
    const allInvitations = store.getInvitations();
    const allEmailLogs = store.getEmailLogs();

    const regularUsers = allUsers.filter(u => u.role === 'user');
    const organizers = allUsers.filter(u => u.role === 'organizer');
    const admins = allUsers.filter(u => u.role === 'admin' || u.role === 'super_admin');

    const totalTicketsSold = allBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const totalPlatformRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const checkedInCount = allBookings.filter(b => b.attendanceStatus === 'checked_in').length;

    // Category breakdown
    const categoryStats = {};
    allEvents.forEach(e => {
      categoryStats[e.category] = (categoryStats[e.category] || 0) + 1;
    });

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalEvents: allEvents.length,
          activeEvents: allEvents.filter(e => e.status === 'approved').length,
          pendingEvents: allEvents.filter(e => e.status === 'pending').length,
          totalTicketsSold,
          totalPlatformRevenue,
          checkedInCount,
          totalUsers: regularUsers.length,
          totalOrganizers: organizers.length,
          totalVenues: allVenues.length,
          totalInvitations: allInvitations.length,
          totalEmailsDispatched: allEmailLogs.length
        },
        categoryStats,
        allEvents,
        allBookings,
        allUsers: allUsers.map(({ password, ...u }) => u),
        allVenues,
        allInvitations,
        allEmailLogs
      }
    });
  } catch (error) {
    console.error('getAdminOverview error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve admin overview.' });
  }
};

exports.sendTestVerificationEmail = async (req, res) => {
  try {
    const { toEmail } = req.body;
    const recipient = toEmail || req.user.email;
    const result = await sendEmail({
      to: recipient,
      subject: '🪔 UtsavMitra SendGrid Email Verification Test',
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
          <h2 style="color: #fb923c; margin-top: 0;">🪔 UtsavMitra SendGrid Verification</h2>
          <p>This is a live transactional verification test dispatched via the UtsavMitra SendGrid mail engine.</p>
          <div style="background: #1e293b; padding: 12px; border-radius: 8px; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Recipient:</strong> ${recipient}</p>
            <p style="margin: 4px 0;"><strong>Triggered By:</strong> ${req.user.name} (${req.user.role})</p>
            <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString('en-IN')}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Authenticated &amp; Verified</p>
          </div>
        </div>
      `,
      type: 'ADMIN_TEST_VERIFICATION',
      metadata: { initiatedBy: req.user.email }
    });
    return res.status(200).json({
      success: true,
      message: `SendGrid verification email dispatched to ${recipient}!`,
      result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send test email.' });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isFeatured } = req.body; // status: 'approved', 'rejected', 'pending', 'completed'

    const event = store.getEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;

    const updated = store.updateEvent(id, updates);
    store.logAction(
      req.user,
      'ADMIN_EVENT_STATUS_CHANGE',
      'EVENT',
      id,
      `Changed event "${updated.title}" status to ${status || 'featured status: ' + isFeatured}`,
      req
    );

    return res.status(200).json({
      success: true,
      message: `Event status updated to '${status || 'modified'}'.`,
      event: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update event status.' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'active', 'suspended'

    const targetUser = store.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Admin cannot suspend super admin or other admins
    if (targetUser.role === 'super_admin' || (req.user.role === 'admin' && targetUser.role === 'admin')) {
      return res.status(403).json({ success: false, message: 'Only Super Admin can modify administrator accounts.' });
    }

    const updated = store.updateUser(id, { status });
    store.logAction(
      req.user,
      'USER_STATUS_CHANGE',
      'USER',
      id,
      `Changed user "${targetUser.name}" status to ${status}`,
      req
    );

    const { password: _, ...userClean } = updated;
    return res.status(200).json({
      success: true,
      message: `User status changed to ${status}.`,
      user: userClean
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

exports.getAllBookingsMaster = async (req, res) => {
  try {
    const bookings = store.getBookings();
    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings ledger.' });
  }
};

