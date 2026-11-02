const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.get('/pass/:passId', bookingController.getBookingByPassId); // Lookup pass
router.post('/check-in', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), bookingController.checkInGuest);
router.get('/event/:eventId/attendees', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), bookingController.getEventAttendees);

module.exports = router;
