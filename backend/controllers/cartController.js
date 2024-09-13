// controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createCart = async (req, res) => {
  try {
    const { client, products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // Find the user by ID
    const user = await User.findById(client);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let totalPrice = 0;

    for (const product of products) {
      const prod = await Product.findById(product.productId); 

      if (!prod) {
        return res
          .status(400)
          .json({ error: `Product with ID ${product.productId} not found` });
      }

      const price = prod.price || 0;
      const quantity = product.quantity || 0;

      totalPrice += price * quantity;
    }

    console.log("Total Price:", totalPrice);

    // Find or create the cart for the user
    let cart = await Cart.findOne({ client });

    if (!cart) {
      cart = new Cart({
        client,
        products,
        totalPrice,
      });
    } else {
      // Update existing cart
      products.forEach((newProduct) => {
        const index = cart.products.findIndex(
          (p) => p.productId.toString() === newProduct.productId.toString()
        );

        if (index > -1) {
          cart.products[index].quantity = newProduct.quantity;
        } else {
          cart.products.push(newProduct);
        }
      });

      cart.totalPrice = 0;
      for (const product of cart.products) {
        const prod = await Product.findById(product.productId);
        const price = prod ? prod.price : 0;
        const quantity = product.quantity || 0;
        cart.totalPrice += price * quantity;
      }
    }

    // Save the updated or new cart
    await cart.save();

    return res.status(201).json(cart);
  } catch (error) {
    // Handle any errors
    return res.status(400).json({ error: error.message });
  }
};
export const getCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findOne({ client: req.params.id }).populate(
      "products.productId"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { products } = req.body;
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }
    const cart = await Cart.findOne({ client: req.params.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Loop through the products and update quantities
    for (const { productId, quantity } of products) {
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found in cart` });
      }

      // Update the quantity of the product
      cart.products[productIndex].quantity = quantity;
    }

    // Optionally update the total price if it's provided
    // if (totalPrice !== undefined) {
    //   cart.totalPrice = totalPrice;
    // }

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart); // Send back the updated cart
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const { clientId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ client: clientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    // Optionally, update totalPrice if needed
    // cart.totalPrice = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Save the cart
    await cart.save();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
