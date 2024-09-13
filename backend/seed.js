import mongoose from 'mongoose';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import Wishlist from './models/Wishlist.js';
import Cart from './models/Cart.js';
import Product from './models/Product.js';
import User from './models/User.js';
import Category from './models/Category.js'; // Import Category model

mongoose.connect('mongodb://localhost:27017/ecommerceArtisan');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Seed categories
    const categories = await Category.insertMany([
      { name: 'Decor', description: 'Decorative items' },
      { name: 'Accessories', description: 'Fashion accessories' },
      { name: 'Art', description: 'Artistic creations' },
      { name: 'Kitchen', description: 'Kitchenware' },
      { name: 'Clothing', description: 'Clothing items' },
      // Add more categories if needed
    ]);

    // Seed users
    const users = await User.insertMany([
      { firstname: 'John', lastname: 'Doe', email: 'john@example.com', isVerified: true, password: 'password123', role: 'user', facebookId: null, googleId: null ,adress : "user adress 1"},
      { firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', isVerified: true, password: 'password123', role: 'artisan', facebookId: null, googleId: null,adress : "user adress 2"},
      { firstname: 'Artisan', lastname: 'Joe', email: 'joe@example.com', isVerified: true, password: 'password123', role: 'artisan', shopDescription: 'Handmade Crafts', facebookId: null, googleId: null,adress : "user adress 3" },
      // Add more users if needed
    ]);

    // Seed products
    const products = await Product.insertMany([
      { name: 'Handmade Vase', description: 'A beautiful vase.', price: 20, stock: 10, category: categories[0]._id, artisan: users[1]._id, photos: ['uploads/photos/artisan_1.jfif'] },
      { name: 'Leather Wallet', description: 'A sturdy leather wallet.', price: 30, stock: 15, category: categories[1]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_2.jfif'] },
      { name: 'Wooden Sculpture', description: 'A handcrafted wooden sculpture.', price: 50, stock: 5, category: categories[2]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_3.jfif'] },
      { name: 'Ceramic Bowl', description: 'A handcrafted ceramic bowl.', price: 25, stock: 8, category: categories[3]._id, artisan: users[1]._id, photos: ['uploads/photos/artisan_4.jpg', 'uploads/photos/artisan_5.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Wooden Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Handmade Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Handmade Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },
      { name: 'Knitted Scarf', description: 'A warm knitted scarf.', price: 15, stock: 20, category: categories[4]._id, artisan: users[2]._id, photos: ['uploads/photos/artisan_6.jpg'] },

    ]);

    console.log('Data seeded successfully!');
    console.log('Products seeded:', products);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedData();
