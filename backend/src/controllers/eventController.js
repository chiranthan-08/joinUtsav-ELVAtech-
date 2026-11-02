const store = require('../data/inMemoryStore');

exports.getAllEvents = async (req, res) => {
  try {
    let events = store.getEvents();
    const { category, search, city, status } = req.query;

    // Normal users see approved events by default unless filtered
    if (status) {
      events = events.filter(e => e.status === status);
    } else if (!req.user || req.user.role === 'user') {
      events = events.filter(e => e.status === 'approved');
    }

    if (category && category !== 'All') {
      events = events.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }

    if (city && city !== 'All') {
      events = events.filter(e => e.city.toLowerCase() === city.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      events = events.filter(e => 
        e.title.toLowerCase().includes(q) ||
        (e.tagline && e.tagline.toLowerCase().includes(q)) ||
        e.description.toLowerCase().includes(q) ||
        e.venueName.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('getAllEvents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = store.getEventById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Increment views
    store.updateEvent(id, { viewsCount: (event.viewsCount || 0) + 1 });

    return res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve event.' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title, tagline, description, category, date, time, endDate, endTime,
      venueName, venueAddress, city, state, bannerUrl, ticketTiers,
      dressCode, highlights, schedule, totalCapacity
    } = req.body;

    if (!title || !category || !date || !time || !venueName || !city) {
      return res.status(400).json({ success: false, message: 'Please provide all required event details.' });
    }

    const defaultBanner = bannerUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80';

    const normalizedTiers = (ticketTiers && ticketTiers.length > 0) ? ticketTiers : [
      {
        id: 'tier_gen_' + Date.now(),
        name: 'General Admission',
        price: 0,
        totalSeats: totalCapacity || 200,
        bookedSeats: 0,
        description: 'Standard access to the event arena',
        perks: ['Standard Entry', 'Event Access']
      }
    ];

    const newEvent = store.createEvent({
      title,
      tagline: tagline || '',
      description: description || 'Join us for an unforgettable celebration of tradition, arts, and togetherness.',
      category,
      date,
      time,
      endDate: endDate || date,
      endTime: endTime || '10:00 PM',
      venueName,
      venueAddress: venueAddress || `${venueName}, ${city}`,
      city,
      state: state || 'Rajasthan',
      organizerId: req.user._id,
      organizerName: req.user.organization || req.user.name,
      organizerEmail: req.user.email,
      bannerUrl: defaultBanner,
      ticketTiers: normalizedTiers,
      dressCode: dressCode || 'Festive Indian / Smart Ethnic',
      highlights: highlights || ['Live Music & Entertainment', 'Food & Refreshment Counters', 'Grand Celebration'],
      schedule: schedule || [{ time, activity: 'Event Inauguration & Grand Welcome', description: 'Doors open for guests.' }],
      totalCapacity: Number(totalCapacity) || 500,
      status: (req.user.role === 'admin' || req.user.role === 'super_admin') ? 'approved' : 'approved' // auto-approve for seamless experience
    });

    store.logAction(req.user, 'EVENT_CREATED', 'EVENT', newEvent._id, `Created event: ${newEvent.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Event created successfully!',
      event: newEvent
    });
  } catch (error) {
    console.error('createEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = store.getEventById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Check ownership unless admin/super_admin
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && existing.organizerId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this event.' });
    }

    const updated = store.updateEvent(id, req.body);
    store.logAction(req.user, 'EVENT_UPDATED', 'EVENT', id, `Updated event: ${updated.title}`, req);

    return res.status(200).json({
      success: true,
      message: 'Event updated successfully!',
      event: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = store.getEventById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'super_admin' && existing.organizerId !== req.user._id) {
      return res.status(403).json({ success: false, message: 'You do not have permission to delete this event.' });
    }

    store.deleteEvent(id);
    store.logAction(req.user, 'EVENT_DELETED', 'EVENT', id, `Deleted event: ${existing.title}`, req);

    return res.status(200).json({
      success: true,
      message: 'Event deleted successfully!'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const allEvents = store.getEvents();
    const myEvents = allEvents.filter(e => e.organizerId === organizerId);

    // Calculate metrics for organizer
    const allBookings = store.getBookings();
    const myEventIds = myEvents.map(e => e._id);
    const myBookings = allBookings.filter(b => myEventIds.includes(b.eventId));

    const totalTicketsSold = myBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const totalRevenue = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalAttendeesCheckedIn = myBookings.filter(b => b.attendanceStatus === 'checked_in').length;

    return res.status(200).json({
      success: true,
      events: myEvents,
      metrics: {
        totalEvents: myEvents.length,
        totalTicketsSold,
        totalRevenue,
        totalAttendeesCheckedIn,
        totalPendingCheckIns: totalTicketsSold - totalAttendeesCheckedIn
      }
    });
  } catch (error) {
    console.error('getOrganizerEvents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch organizer events.' });
  }
};
