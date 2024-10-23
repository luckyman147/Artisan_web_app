import Product from '../models/Product.js'; 
import User from '../models/User.js';
import  deleteFiles  from '../utils/fileUtils.js';


export const createProduit =async (req, res) => {
  try {
    const photos = req.files.map(file => file.path); 
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user || user.role !== 'artisan') {
      return res.status(403).json({ message: 'User not authenticated' });
    }
    const product = new Product({
      ...req.body,
      artisan: req.user.id,
      photos: photos,
      
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
    const sortCriteria = {};

    // Helper function to build the filter for numeric ranges
    const buildRangeFilter = (field, min, max) => {
      const rangeFilter = {};
      if (min) rangeFilter.$gte = Number(min);
      if (max) rangeFilter.$lte = Number(max);
      return Object.keys(rangeFilter).length > 0 ? { [field]: rangeFilter } : {};
    };

    // Apply filters
    if (filters.name) {
      filterCriteria.name = new RegExp(filters.name, 'i');
    }

    Object.assign(filterCriteria, buildRangeFilter('price', filters.minPrice, filters.maxPrice));
    Object.assign(filterCriteria, buildRangeFilter('stock', filters.stock));

    if (filters.category) {
      filterCriteria.category = mongoose.Types.ObjectId(filters.category);
    }

    Object.assign(filterCriteria, buildRangeFilter('createdAt', filters.createdAfter, filters.createdBefore));

    // Artisan filter
    if (filters.artisanFirstname || filters.artisanLastname) {
      const artisanCriteria = {};
      if (filters.artisanFirstname) {
        artisanCriteria.firstname = new RegExp(filters.artisanFirstname, 'i');
      }
      if (filters.artisanLastname) {
        artisanCriteria.lastname = new RegExp(filters.artisanLastname, 'i');
      }

      const artisans = await User.find(artisanCriteria).select('_id');
      const artisanIds = artisans.map(artisan => artisan._id);
      if (artisanIds.length) {
        filterCriteria.artisan = { $in: artisanIds };
      }
    }

    // Sort criteria
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
    // Fetch the product and populate the category field
    const product = await Product.findById(req.params.id).populate('category'); 

    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
// Mettre à jour un produit par ID
export const updateProduitById = async (req, res) => {
  try {
    const userId = req.user.id; 
    const productId = req.params.id;

    // Fetch the current product to get the existing photos
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    let photos;

    // Check if new photos are uploaded
    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => file.path);
    } else {
      // If no new photos are uploaded, retain existing photos
      photos = existingProduct.photos;
    }

    // Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...req.body, photos: photos },
      { new: true }
    );

    // Check if the user is authorized to update the product
    if (updatedProduct.artisan.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Return the updated product
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

export const getProductsByArtisanId = async (req, res) => {
  try {
    const products = await Product.find({ artisan: req.params.artisanId })
      .populate('category')
      .sort({ createdAt: 'desc' }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ tracking_number: { $exists: true, $ne: null } })
      .sort({ tracking_number: -1 }) 
      .limit(3) 
      .populate('category') 
      .populate('artisan'); 

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
