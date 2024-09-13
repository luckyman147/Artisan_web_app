// controllers/orderController.js

import Order from '../models/Order.js';
import User from "../models/User.js"; 

export const createOrder = async (req, res) => {
  try {
    const { clientId, details, delivery_address } = req.body;

    // Fetch the user's data
    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate the total amount
    let montant_total = 0;
    details.forEach(item => {
      montant_total += item.quantité * item.prix_unitaire;
    });

    // Set the delivery address to the user's address if not provided
    const orderDeliveryAddress = delivery_address || {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.adress,
      zipCode: "", 
      country : "Tunisie"
    };

    // Create the order
    const order = new Order({
      client_id : clientId,
      montant_total,
      details,
      delivery_address: orderDeliveryAddress, 
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Lire toutes les commandes
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lire une commande par ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une commande par ID
export const updateOrderById = async (req, res) => {
  try {
    const { statut, details } = req.body;

    let montant_total = 0;
    if (details) {
      details.forEach(item => {
        montant_total += item.quantité * item.prix_unitaire;
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { statut, details, montant_total },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une commande par ID
export const deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    res.json({ message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
