import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String},
  price: { type: Number },
  stock: { type: Number  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  size: { type: String }, // Exemple de tailles : 'S', 'M', 'L', 'XL'

  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  photos: [{ type: String }] 
});
const Product = mongoose.model('Product', ProductSchema);
 
export default Product;
