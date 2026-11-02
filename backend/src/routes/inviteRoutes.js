const express = require('express');
const router = express.Router();
const inviteController = require('../controllers/inviteController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, inviteController.createInvitation);
router.get('/my-invitations', authMiddleware, inviteController.getMyInvitations);
router.get('/:slug', inviteController.getInvitationBySlug);
router.post('/:slug/rsvp', inviteController.submitRSVP);

module.exports = router;
