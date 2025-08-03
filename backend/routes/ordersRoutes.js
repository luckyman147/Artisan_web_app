import express from 'express';
import {createOrder, getAllOrders,getOrderById,updateOrderById,deleteOrderById,getOrderByIdArtisan,getArtisanOfTheMonth,getStaticOfArtisan} from '../controllers/orderController.js';
import { checkAuth,checkAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Créer une nouvelle commande
router.post('/', createOrder);

// Lire toutes les commandes
router.get('/', getAllOrders);
router.get('/artisan_of_the_month', getArtisanOfTheMonth);

// Lire une commande par ID
router.get('/:id', getOrderById);
router.get('/Static_Of_Artisan/:id', getStaticOfArtisan);

router.get('/artisan/:id', getOrderByIdArtisan);


// router.get('/admin/revenue', getRevenuAdmin);


// Mettre à jour une commande par ID
router.put('/:id', updateOrderById);

// Supprimer une commande par ID
router.delete('/:id', deleteOrderById);

export default router; 
