const store = require('../data/inMemoryStore');
const { expandSearchQuery, normalizeCity } = require('../utils/searchHelper');

exports.getAllVenues = async (req, res) => {
  try {
    let venues = store.getVenues();
    const { city, type, search } = req.query;

    if (city && city !== 'All') {
      const normTarget = normalizeCity(city).toLowerCase();
      venues = venues.filter(v => {
        const normCity = normalizeCity(v.city).toLowerCase();
        return normCity === normTarget || 
               v.city.toLowerCase().includes(city.toLowerCase()) || 
               city.toLowerCase().includes(v.city.toLowerCase());
      });
    }

    if (type && type !== 'All') {
      venues = venues.filter(v => v.type.toLowerCase() === type.toLowerCase());
    }

    let searchMetadata = null;
    if (search && search.trim()) {
      const expansion = expandSearchQuery(search.trim());
      const { expandedTerms, matchedCities, originalQuery } = expansion;

      venues = venues.filter(v => {
        const vCity = (v.city || '').toLowerCase();
        const vNormCity = normalizeCity(v.city).toLowerCase();
        const vBlob = `${v.name} ${v.city} ${v.state || ''} ${v.address} ${v.type} ${(v.amenities || []).join(' ')} ${v.description || ''}`.toLowerCase();

        // City match
        if (matchedCities.some(mc => mc.toLowerCase() === vCity || mc.toLowerCase() === vNormCity)) {
          return true;
        }

        // Substring / expanded terms match
        if (expandedTerms.some(term => term.length >= 2 && vBlob.includes(term))) {
          return true;
        }

        return vBlob.includes(originalQuery);
      });

      searchMetadata = {
        originalQuery: search.trim(),
        matchedCities: expansion.matchedCities,
        explanation: expansion.explanation
      };
    }

    return res.status(200).json({
      success: true,
      count: venues.length,
      venues,
      searchMetadata
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve venues.' });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = store.getVenueById(id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }
    return res.status(200).json({ success: true, venue });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve venue details.' });
  }
};

exports.submitInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventType, eventDate, guestsCount, message, contactPhone } = req.body;

    const venue = store.getVenueById(id);
    if (!venue) {
      return res.status(404).json({ success: false, message: 'Venue not found.' });
    }

    const inquiry = {
      _id: 'inq_' + Date.now(),
      userName: req.user ? req.user.name : (req.body.name || 'Interested Host'),
      userEmail: req.user ? req.user.email : (req.body.email || 'host@example.com'),
      userPhone: contactPhone || (req.user ? req.user.phone : ''),
      eventType: eventType || 'Grand Celebration',
      eventDate: eventDate || '2026-12-01',
      guestsCount: Number(guestsCount) || 300,
      message: message || 'Please send venue pricing and date availability.',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    venue.inquiries = venue.inquiries || [];
    venue.inquiries.push(inquiry);
    store.updateVenue(id, { inquiries: venue.inquiries });

    store.logAction(
      req.user || { _id: 'guest', name: inquiry.userName, role: 'user' },
      'VENUE_INQUIRY',
      'VENUE',
      venue._id,
      `Submitted inquiry for ${venue.name} (${inquiry.eventType})`,
      req
    );

    return res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully! Venue manager will contact you shortly.',
      inquiry
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit venue inquiry.' });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const { name, city, state, address, capacity, pricePerDay, type, amenities, images, description, contactPerson, contactPhone } = req.body;
    if (!name || !city || !address || !capacity || !pricePerDay) {
      return res.status(400).json({ success: false, message: 'Please provide all required venue fields.' });
    }

    const newVenue = store.createVenue({
      name,
      city,
      state: state || 'Rajasthan',
      address,
      capacity: Number(capacity),
      pricePerDay: Number(pricePerDay),
      type: type || 'Banquet Hall',
      amenities: amenities || ['Air Conditioned', 'Ample Parking', 'Catering Available'],
      images: images || ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80'],
      description: description || 'Elegant destination venue for grand celebrations.',
      contactPerson: contactPerson || req.user.name,
      contactPhone: contactPhone || req.user.phone
    });

    store.logAction(req.user, 'VENUE_CREATED', 'VENUE', newVenue._id, `Registered venue: ${newVenue.name}`, req);

    return res.status(201).json({
      success: true,
      message: 'Venue listed successfully!',
      venue: newVenue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create venue.' });
  }
};

