// models/Wishlist.js
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  createdAt: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;