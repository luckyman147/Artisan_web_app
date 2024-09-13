// routes/wishlistRoutes.js
import express from 'express';
const router = express.Router();
import {createWishlist,getWishlists, getWishlistById,updateWishlist,deleteWishlist} from '../controllers/wishlistController.js';

router.post('/', createWishlist);
router.get('/', getWishlists);
router.get('/:id', getWishlistById);
router.put('/:id', updateWishlist);
router.delete('/:productId/:clientId', deleteWishlist);

export default router; 
