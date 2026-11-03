const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// All admin routes require admin or super_admin role
router.use(authMiddleware, roleMiddleware(['admin', 'super_admin']));

router.get('/overview', adminController.getAdminOverview);
router.get('/bookings', adminController.getAllBookingsMaster);
router.post('/send-test-email', adminController.sendTestVerificationEmail);
router.patch('/events/:id/status', adminController.updateEventStatus);
router.patch('/users/:id/status', adminController.updateUserStatus);

module.exports = router;

