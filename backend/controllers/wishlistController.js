// controllers/wishlistController.js
import Product from "../models/Product.js";
import Wishlist from "../models/Wishlist.js";

export const createWishlist = async (req, res) => {
  try {
    const { client, products } = req.body;

    // Check if a wishlist already exists for the given client
    let wishlist = await Wishlist.findOne({ client });

    if (wishlist) {
      // If wishlist exists, check if the product is already in the wishlist
      if (wishlist.products.includes(products)) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }

      // Add the product to the existing wishlist
      wishlist.products.push(products);
      await wishlist.save();
      return res.status(200).json(wishlist);
    } else {
      // If wishlist does not exist, create a new one with the product
      wishlist = new Wishlist({
        products: [products],
        client: client,
      });
      await wishlist.save();
      return res.status(201).json(wishlist);
    }
  } catch (error) {
    console.error("Error adding wishlist:", error);
    res.status(400).json({ error: error.message });
  }
};
export const getWishlists = async (req, res) => {
  try {
    const wishlists = await Wishlist.find();
    res.status(200).json(wishlists);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ client: req.params.id });

    if (!wishlist.length) {
      return res.status(404).json({ message: "Wishlist not found" });
    }
    const wishlistWithProducts = await Promise.all(
      wishlist.map(async (e) => {
        const products = await Product.find({ _id: { $in: e.products } });
        return { ...e.toObject(), products };
      })
    );
    res.status(200).json(wishlistWithProducts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!wishlist)
      return res.status(404).json({ message: "Wishlist not found" });
    res.status(200).json(wishlist);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteWishlist = async (req, res) => {
  try {
    const { productId, clientId } = req.params;
    const wishlist = await Wishlist.findOne({client : clientId}); 

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (product) => product.toString() !== productId
    );

    if (wishlist.products.length === 0) {
      await Wishlist.findByIdAndDelete({_id : wishlist._id});
      return res
        .status(200)
        .json({ message: "Wishlist and all products deleted" });
    }

    await wishlist.save();

    res.status(200).json({ message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
