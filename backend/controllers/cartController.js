import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const createCart = async (req, res) => {
  try {
    const { client, products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products provided" });
    }

    // const user = await User.findById(client);
    // if (!user) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    let totalPrice = 0;

    for (const product of products) {
      const prod = await Product.findById(product.productId);

      if (!prod) {
        return res
          .status(400)
          .json({ error: `Product with ID ${product.productId} not found` });
      }

      const price = prod.promo
        ? prod.price * (1 - prod.discountPercentage / 100) 
        : prod.price; 

      const quantity = product.quantity || 0;

      totalPrice += price * quantity; 
    }


    let cart = await Cart.findOne({ client });

    if (!cart) {
      cart = new Cart({
        client,
        products,
        totalPrice,
      });
    } else {
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
        // const prod = await Product.findById(product.productId);

        // if (!prod) {
        //   return res
        //     .status(400)
        //     .json({ error: `Product with ID ${product.productId} not found` });
        // }

        const price = prod.promo
          ? prod.price * (1 - prod.discountPercentage / 100)
          : prod.price;

        const quantity = product.quantity || 0;
        cart.totalPrice += price * quantity;
      }
    }

    await cart.save();

    return res.status(201).json(cart);
  } catch (error) {
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

    let totalPrice = 0;

    for (const { productId, quantity } of products) {
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex === -1) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found in cart` });
      }

      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found in products collection` });
      }

      if (quantity > product.stock) {
        return res
          .status(400)
          .json({
            message: `Insufficient stock for product ${product.name}. Available stock: ${product.stock}. Requested: ${quantity}.`,
          });
      }

      cart.products[productIndex].quantity = quantity;
      cart.products[productIndex].price = product.price; 

      totalPrice += product.price * quantity;
      cart.totalPrice += totalPrice-product.price ;

    }

    await cart.save();

    res.status(200).json(cart); 
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: error.message });
  }
};



export const deleteCart = async (req, res) => {
  const { clientId, productId } = req.params;

  try {
    // Find the cart by client ID
    const cart = await Cart.findOne({ client: clientId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products.splice(productIndex, 1);

    cart.totalPrice = 0;

    for (const item of cart.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.productId} not found` });
      }

      const price = product.promo
        ? product.price * (1 - product.discountPercentage / 100) 
        : product.price;

      cart.totalPrice += price * item.quantity;
    }

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", totalPrice: cart.totalPrice });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(400).json({ error: error.message });
  }
};



export const deleteAllCart = async (req, res) => {
  const { clientId } = req.params; 

  try {
    const cart = await Cart.findOne({ client: clientId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Clear all products from the cart
    cart.products = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: "All products removed from cart", cart });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
