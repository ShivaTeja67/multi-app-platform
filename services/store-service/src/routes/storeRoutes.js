import express from 'express';
import {
  getProducts,
  getProductById,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/storeController.js';
import { verifyAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/cart', verifyAuth, getCart);
router.post('/cart', verifyAuth, addToCart);
router.put('/cart', verifyAuth, updateCartItem);
router.delete('/cart/:productId', verifyAuth, removeFromCart);
router.delete('/cart', verifyAuth, clearCart);

export default router;
