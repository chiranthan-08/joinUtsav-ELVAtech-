const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// Super Admin only routes
router.use(authMiddleware, roleMiddleware(['super_admin']));

router.get('/overview', superAdminController.getSuperAdminOverview);
router.post('/admins', superAdminController.createAdmin);
router.patch('/users/:id/role', superAdminController.updateUserRole);
router.put('/settings', superAdminController.updateGlobalSettings);
router.get('/audit-logs', superAdminController.getAuditLogs);
router.post('/reset-seed', superAdminController.resetToSeedData);

module.exports = router;

