// routes/cartRoutes.js
import express from 'express';
const router = express.Router();
import {createCart,getCarts, getCartById , updateCart, deleteCart} from '../controllers/cartController.js';

router.post('/', createCart);
router.get('/', getCarts);
router.get('/:id', getCartById);
router.put('/:id', updateCart);
router.delete('/:clientId/:productId', deleteCart);

export default router; 
