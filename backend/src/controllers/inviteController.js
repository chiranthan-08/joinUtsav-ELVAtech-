const store = require('../data/inMemoryStore');

exports.createInvitation = async (req, res) => {
  try {
    const { title, hostName, eventType, eventDate, eventTime, venue, theme, customMessage, coverImage } = req.body;

    if (!title || !hostName || !eventType || !eventDate || !venue) {
      return res.status(400).json({ success: false, message: 'Please provide all essential invitation details.' });
    }

    const newInvite = store.createInvitation({
      title,
      hostName,
      eventType,
      eventDate,
      eventTime: eventTime || '06:00 PM',
      venue,
      theme: theme || 'royal-marigold',
      coverImage: coverImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      customMessage: customMessage || 'We cordially invite you and your family to grace the occasion with your auspicious presence.',
      createdBy: req.user._id
    });

    store.logAction(req.user, 'INVITATION_CREATED', 'INVITATION', newInvite._id, `Created e-invite: ${newInvite.title}`, req);

    return res.status(201).json({
      success: true,
      message: 'Digital Invitation created! Share your link with friends and family.',
      invitation: newInvite
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create digital invitation.' });
  }
};

exports.getInvitationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const invite = store.getInvitationBySlug(slug) || store.getInvitationById(slug);
    if (!invite) {
      return res.status(404).json({ success: false, message: 'Invitation card not found.' });
    }

    return res.status(200).json({
      success: true,
      invitation: invite
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to retrieve invitation.' });
  }
};

exports.submitRSVP = async (req, res) => {
  try {
    const { slug } = req.params;
    const { guestName, guestPhone, guestsCount, status, message, dietaryNotes } = req.body;

    if (!guestName) {
      return res.status(400).json({ success: false, message: 'Guest name is required for RSVP.' });
    }

    const updated = store.addRSVP(slug, {
      guestName,
      guestPhone: guestPhone || '',
      guestsCount: Number(guestsCount) || 1,
      status: status || 'attending',
      message: message || '',
      dietaryNotes: dietaryNotes || 'No specific restrictions'
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Invitation not found.' });
    }

    store.logAction(
      { _id: 'guest', name: guestName, role: 'user' },
      'RSVP_SUBMITTED',
      'INVITATION',
      updated._id,
      `RSVP (${status}) submitted by ${guestName} (${guestsCount || 1} guests)`,
      req
    );

    return res.status(200).json({
      success: true,
      message: status === 'attending' ? 'Dhanyawaad! Your RSVP has been confirmed.' : 'Thank you for letting the host know.',
      invitation: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to submit RSVP.' });
  }
};

exports.getMyInvitations = async (req, res) => {
  try {
    const invites = store.getInvitations().filter(i => i.createdBy === req.user._id);
    return res.status(200).json({
      success: true,
      count: invites.length,
      invitations: invites
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch your invitations.' });
  }
};
