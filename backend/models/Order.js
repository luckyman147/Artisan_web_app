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
      accepte: {
        type: String,
        enum: ["en cours", "accepte", "annulée"],
        default: "en cours",
      },
    },
  ],
  delivery_address: [
    {
      firstname: {
        type: String,
        required: false,
      },
      lastname: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
      phone: {
        type: Number,
        required: false,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
