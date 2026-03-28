import express from 'express';
import {
  getStats,
  getActivity,
  getOrders,
  getSettings,
  updateSettings
} from '../controllers/dashboardController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', verifyAuth, getStats);
router.get('/activity', verifyAuth, getActivity);
router.get('/orders', verifyAuth, getOrders);
router.get('/settings', verifyAuth, getSettings);
router.put('/settings', verifyAuth, updateSettings);

export default router;
