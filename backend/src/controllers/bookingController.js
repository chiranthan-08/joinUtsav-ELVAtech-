const Razorpay = require('razorpay');
const store = require('../data/inMemoryStore');

// Optional Razorpay instance
let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_UtsavMitraKey2026',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'utsavmitra_secret_test_key_8849'
  });
} catch (e) {
  console.log('[Notice]: Razorpay SDK initialized in simulation mode.');
}

exports.createBooking = async (req, res) => {
  try {
    const { eventId, ticketTier, quantity = 1, paymentMethod = 'razorpay', paymentId } = req.body;

    const event = store.getEventById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const tier = (event.ticketTiers || []).find(t => t.name === ticketTier || t.id === ticketTier);
    const unitPrice = tier ? tier.price : 0;
    const totalAmount = unitPrice * Number(quantity);

    // Create booking object
    const booking = await store.createBooking({
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.date,
      eventVenue: `${event.venueName}, ${event.city}`,
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone,
      ticketTier: tier ? tier.name : 'General Admission',
      quantity: Number(quantity),
      unitPrice,
      totalAmount,
      paymentStatus: 'paid',
      paymentMethod: totalAmount === 0 ? 'free_pass' : paymentMethod,
      razorpayPaymentId: paymentId || ('pay_rzp_' + Math.random().toString(36).substring(2, 10)),
      razorpayOrderId: 'order_rzp_' + Math.random().toString(36).substring(2, 10)
    });

    store.logAction(
      req.user,
      'TICKET_BOOKED',
      'BOOKING',
      booking._id,
      `Booked ${quantity}x ${booking.ticketTier} for ${event.title} (₹${totalAmount})`,
      req
    );

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Your digital QR pass is ready.',
      booking
    });
  } catch (error) {
    console.error('createBooking error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process ticket booking.' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = store.getBookings().filter(b => b.userId === req.user._id);
    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch your bookings.' });
  }
};

exports.getBookingByPassId = async (req, res) => {
  try {
    const { passId } = req.params;
    const booking = store.getBookingByPassId(passId);
    if (!booking) {
      return res.status(404).json({ success: false, message: `Pass ID '${passId}' not found in platform records.` });
    }

    const event = store.getEventById(booking.eventId);

    return res.status(200).json({
      success: true,
      booking,
      event
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to look up pass details.' });
  }
};

exports.checkInGuest = async (req, res) => {
  try {
    const { passId } = req.body;
    if (!passId) {
      return res.status(400).json({ success: false, message: 'Please provide a valid Pass ID or QR code.' });
    }

    // Clean passId if QR code contained JSON string
    let cleanPassId = passId.trim();
    if (cleanPassId.startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanPassId);
        if (parsed.passId) cleanPassId = parsed.passId;
      } catch (e) {}
    }

    const booking = store.getBookingByPassId(cleanPassId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        status: 'INVALID_PASS',
        message: `Invalid Pass! ID "${cleanPassId}" does not exist in platform database.`
      });
    }

    // Check if already checked in
    if (booking.attendanceStatus === 'checked_in') {
      return res.status(400).json({
        success: false,
        status: 'ALREADY_CHECKED_IN',
        message: `DUPLICATE ENTRY DETECTED! Pass ${booking.passId} was already checked in on ${new Date(booking.checkedInAt).toLocaleTimeString()} by ${booking.checkedInBy || 'Gate Staff'}.`,
        booking
      });
    }

    // Perform check in
    const updated = store.updateBooking(booking._id, {
      attendanceStatus: 'checked_in',
      checkedInAt: new Date().toISOString(),
      checkedInBy: req.user.name + ` (${req.user.role})`
    });

    store.logAction(
      req.user,
      'ATTENDANCE_CHECKED_IN',
      'BOOKING',
      updated._id,
      `Checked-in guest ${updated.userName} for ${updated.eventTitle} (${updated.passId})`,
      req
    );

    return res.status(200).json({
      success: true,
      status: 'CHECK_IN_SUCCESS',
      message: `Verified! Welcome ${updated.userName} to ${updated.eventTitle}. Entry approved.`,
      booking: updated
    });
  } catch (error) {
    console.error('checkInGuest error:', error);
    return res.status(500).json({ success: false, message: 'Check-in processing error.' });
  }
};

exports.getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.query; // 'all', 'checked_in', 'pending'

    let attendees = store.getBookings().filter(b => b.eventId === eventId);
    if (status && status !== 'all') {
      attendees = attendees.filter(b => b.attendanceStatus === status);
    }

    const totalRegistered = attendees.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const checkedInCount = attendees.filter(b => b.attendanceStatus === 'checked_in').length;

    return res.status(200).json({
      success: true,
      count: attendees.length,
      totalRegistered,
      checkedInCount,
      pendingCount: totalRegistered - checkedInCount,
      attendees
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch attendees roster.' });
  }
};

