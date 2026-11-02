const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/budget', aiController.generateBudgetPlan);
router.post('/itinerary', aiController.generateItinerary);
router.post('/invitation-poetry', aiController.generateInvitationPoetry);
router.post('/catering', aiController.generateCateringMenu);
router.post('/chat', aiController.chatAssistant);

module.exports = router;

