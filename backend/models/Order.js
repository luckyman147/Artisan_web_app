// models/Order.js

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  client_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date_commande: {
    type: Date,
    default: Date.now,
  },
  statut: {
    type: String,
    enum: ["en cours", "expédiée", "livrée", "annulée"],
    default: "en cours",
  },
  montant_total: {
    type: Number,
    required: true,
  },
  details: [
    {
      produit_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantité: {
        type: Number,
        required: true,
      },
      prix_unitaire: {
        type: Number,
        required: true,
      },
    },
  ],
  delivery_address: [
    {
      firstname: {
        type: String,
        require: false,
      },
      lastname: {
        type: String,
        require: false,
      },
      address: {
        type: String,
        require: false,
      },
      country: {
        type: String,
        require: false,
      },
      zipCode: {
        type: String,
        require: false,
      },
    },
  ],
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
