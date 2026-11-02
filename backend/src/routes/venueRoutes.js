const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/', venueController.getAllVenues);
router.get('/:id', venueController.getVenueById);
router.post('/:id/inquire', optionalAuthMiddleware, venueController.submitInquiry);
router.post('/', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), venueController.createVenue);

module.exports = router;

