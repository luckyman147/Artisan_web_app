// routes/productRoutes.js
import express from 'express';
import {createProduit, getProduits, getProduitById,updateProduitById ,deleteProduitById , getProductsByArtisanId} from '../controllers/ProductController.js';
import  upload  from '../middlewares/uploadPhoto.js';
import { checkAuth, isArtisan } from '../middlewares/auth.js';


const router = express.Router();
 
// Route pour créer un produit avec upload de photos
router.post('/', checkAuth, isArtisan, upload.array('photos'), createProduit);

// Autres routes pour obtenir, mettre à jour, supprimer les produits
router.get('/', getProduits);
router.get('/:id', getProduitById);
router.put('/:id', checkAuth, isArtisan, upload.array('photos'), updateProduitById);
router.delete('/:id', checkAuth, isArtisan, deleteProduitById);
router.get('/allProductByUser/:artisanId', getProductsByArtisanId);

export default router; 
