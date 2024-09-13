// controllers/productController.js
import Product from '../models/Product.js'; // Assurez-vous que le chemin est correct
import User from '../models/User.js';
import  deleteFiles  from '../utils/fileUtils.js';


export const createProduit =async (req, res) => {
  try {
    const photos = req.files.map(file => file.path); // Chemins des photos
    const userId = req.user.id; // Assurez-vous que req.user contient l'ID de l'utilisateur connecté
    const user = await User.findById(userId);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'User not authenticated' });
    }
    const product = new Product({
      ...req.body,
      artisan: req.user.id,
      photos: photos
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Récupérer tous les produits
export const getProduits = async (req, res) => {
  try {
    const filters = req.query;
    const filterCriteria = {};

    // Apply filters
    if (filters.name) {
      filterCriteria.name = new RegExp(filters.name, 'i');
    }
    if (filters.minPrice) {
      filterCriteria.price = { ...filterCriteria.price, $gte: Number(filters.minPrice) };
    }
    if (filters.maxPrice) {
      filterCriteria.price = { ...filterCriteria.price, $lte: Number(filters.maxPrice) };
    }
    if (filters.category) {
      filterCriteria.category = mongoose.Types.ObjectId(filters.category);
    }
    if (filters.stock) {
      filterCriteria.stock = { $gte: Number(filters.stock) };
    }
    if (filters.createdAfter) {
      filterCriteria.createdAt = { ...filterCriteria.createdAt, $gte: new Date(filters.createdAfter) };
    }
    if (filters.createdBefore) {
      filterCriteria.createdAt = { ...filterCriteria.createdAt, $lte: new Date(filters.createdBefore) };
    }

    if (filters.artisanFirstname || filters.artisanLastname) {
      const artisanCriteria = {};
      if (filters.artisanFirstname) {
        artisanCriteria.firstname = new RegExp(filters.artisanFirstname, 'i');
      }
      if (filters.artisanLastname) {
        artisanCriteria.lastname = new RegExp(filters.artisanLastname, 'i');
      }

      // Find artisans matching the criteria
      const artisans = await User.find(artisanCriteria).select('_id');
      const artisanIds = artisans.map(artisan => artisan._id);

      // Add artisan IDs to filter criteria
      filterCriteria.artisan = { $in: artisanIds };
    }

    const sortCriteria = {};
    if (filters.sort) {
      sortCriteria[filters.sort] = filters.order === 'desc' ? -1 : 1;
    }

    // Populate artisan and category fields
    const products = await Product.find(filterCriteria)
      .sort(sortCriteria)
      .populate({
        path: 'artisan',
        select: 'firstname lastname email company_name'
      })
      .populate({
        path: 'category', 
        select: 'name description' 
      });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Récupérer un produit par ID
export const getProduitById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Mettre à jour un produit par ID
export const updateProduitById = async (req, res) => {
  try {
    const photos = req.files ? req.files.map(file => file.path) : undefined;
    console.log(photos);
    
    const userId = req.user.id; 

  
 
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, photos: photos || undefined },
      { new: true }
    );
    if (updatedProduct.artisan.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!updatedProduct) return res.status(404).json({ message: 'Produit non trouvé' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Supprimer un produit par ID
export const deleteProduitById=  async (req, res) => {
  try {
    const productId = req.params.id;

    // Trouver le produit pour obtenir les chemins des photos
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Supprimer les fichiers des photos
    deleteFiles(product.photos);

    // Supprimer le produit de la base de données
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer les produits par ID d'artisan
export const getProductsByArtisanId = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.params.artisanId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

