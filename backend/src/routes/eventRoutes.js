const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

router.get('/', optionalAuthMiddleware, eventController.getAllEvents);
router.get('/organizer/my-events', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), eventController.getOrganizerEvents);
router.get('/:id', eventController.getEventById);
router.post('/', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), eventController.createEvent);
router.put('/:id', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), eventController.updateEvent);
router.delete('/:id', authMiddleware, roleMiddleware(['organizer', 'admin', 'super_admin']), eventController.deleteEvent);

module.exports = router;

