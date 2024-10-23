import mongoose from "mongoose";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";
import Wishlist from "./models/Wishlist.js";
import Cart from "./models/Cart.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Order from "./models/Order.js";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerceArtisan");

const seedData = async () => {
  try {
    // Clear existing data
    // await User.deleteMany({});
    // await Product.deleteMany({});
    await Category.deleteMany({});

    // Define static categories
    const categories = await Category.insertMany([
      { name: "Decor", description: "Beautiful decor items for your home." },
      { name: "Accessories", description: "Fashion accessories to complement your style." },
      { name: "Art", description: "Original artwork and prints." },
      { name: "Kitchen", description: "Essentials for your kitchen." },
      { name: "Clothing", description: "Stylish clothing for every occasion." },
    ]);

    const products = await Product.insertMany([
      {
        name: "Handmade Vase",
        description: "A beautiful vase.",
        price: 20,
        stock: 10,
        category: categories[0]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_1.jfif"],
        promo: true,
        discountPercentage: 20,
      },
      {
        name: "Leather Wallet",
        description: "A sturdy leather wallet.",
        price: 30,
        stock: 15,
        category: categories[1]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_2.jpg"],
        promo: true,
        discountPercentage: 50,
      },
      {
        name: "Wooden Sculpture",
        description: "A handcrafted wooden sculpture.",
        price: 50,
        stock: 5,
        category: categories[2]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_3.jpg"],
        promo: true,
        discountPercentage: 30,
      },
      {
        name: "Ceramic Bowl",
        description: "A handcrafted ceramic bowl.",
        price: 25,
        stock: 8,
        category: categories[3]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_4.jpg"],
        promo: true,
        discountPercentage: 10,
      },
      {
        name: "Knitted Scarf",
        description: "A warm knitted scarf.",
        price: 15,
        stock: 20,
        category: categories[4]._id,
        artisan: "66fb538e1d04d28bba890b55",
        photos: ["uploads/photos/artisan_5.jpg"],
        promo: true,
        discountPercentage: 20,
      },
      {
        name: "Glass Candle Holder",
        description: "An elegant glass candle holder.",
        price: 18,
        stock: 12,
        category: categories[0]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_6.jpg"],
        promo: true,
        discountPercentage: 15,
      },
      {
        name: "Leather Belt",
        description: "A durable leather belt.",
        price: 35,
        stock: 10,
        category: categories[1]._id,
        artisan: "66fb538e1d04d28bba890b55",
        photos: ["uploads/photos/artisan_7.jpg"],
        promo: true,
        discountPercentage: 5,
      },
      {
        name: "Abstract Painting",
        description: "A vibrant abstract painting.",
        price: 70,
        stock: 3,
        category: categories[2]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_8.jpg"],
        promo: true,
        discountPercentage: 25,
      },
      {
        name: "Ceramic Mug",
        description: "A unique ceramic mug.",
        price: 12,
        stock: 25,
        category: categories[3]._id,
        artisan: "66fb538e1d04d28bba890b55",
        photos: ["uploads/photos/artisan_9.jpg"],
        promo: true,
        discountPercentage: 10,
      },
      {
        name: "Wool Blanket",
        description: "A cozy wool blanket.",
        price: 40,
        stock: 7,
        category: categories[4]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_10.jpg"],
        promo: true,
        discountPercentage: 15,
      },
      {
        name: "Painted Flower Pot",
        description: "A colorful flower pot.",
        price: 22,
        stock: 14,
        category: categories[0]._id,
        artisan: "66fb538e1d04d28bba890b55",
        photos: ["uploads/photos/artisan_11.jpg"],
        promo: true,
        discountPercentage: 5,
      },
      {
        name: "Silk Scarf",
        description: "A luxurious silk scarf.",
        price: 45,
        stock: 6,
        category: categories[1]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_12.jpg"],
        promo: true,
        discountPercentage: 20,
      },
      {
        name: "Handwoven Basket",
        description: "A handwoven basket for storage.",
        price: 30,
        stock: 9,
        category: categories[2]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_13.jpg"],
        promo: true,
        discountPercentage: 10,
      },
      {
        name: "Ceramic Cutting Board",
        description: "A decorative cutting board.",
        price: 28,
        stock: 11,
        category: categories[3]._id,
        artisan: "66fb538e1d04d28bba890b55",
        photos: ["uploads/photos/artisan_14.jpg"],
        promo: true,
        discountPercentage: 15,
      },
      {
        name: "Embroidered Tote Bag",
        description: "A stylish embroidered tote bag.",
        price: 25,
        stock: 20,
        category: categories[4]._id,
        artisan: "66fb538e1d04d28bba890b54",
        photos: ["uploads/photos/artisan_15.jpg"],
        promo: true,
        discountPercentage: 10,
      },
    ]);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
