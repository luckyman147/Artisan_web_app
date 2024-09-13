import express from 'express';
import {createOrder, getAllOrders,getOrderById,updateOrderById,deleteOrderById} from '../controllers/orderController.js';

const router = express.Router();

// Créer une nouvelle commande
router.post('/', createOrder);

// Lire toutes les commandes
router.get('/', getAllOrders);

// Lire une commande par ID
router.get('/:id', getOrderById);

// Mettre à jour une commande par ID
router.put('/:id', updateOrderById);

// Supprimer une commande par ID
router.delete('/:id', deleteOrderById);

export default router; 
