import express from 'express';
import {
  register,
  login,
  logout,
  logoutAll,
  me,
  verify,
  refresh
} from '../controllers/authController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/logout-all', verifyAuth, logoutAll);
router.get('/me', verifyAuth, me);
router.get('/verify', verifyAuth, verify);
router.post('/refresh', refresh);

export default router;
