import Order from '../models/Order.js';
import User from "../models/User.js"; 
import Product from "../models/Product.js";
import nodemailer from 'nodemailer';


export const createOrder = async (req, res) => {
  try {
    const { clientId, details, delivery_address } = req.body;

    const user = await User.findById(clientId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let montant_total = 0;

    for (let item of details) {
      const product = await Product.findById(item.produit_id);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.produit_id} not found` });
      }
      product.tracking_number++;
      await product.save();

      let prix_unitaire = product.promo
        ? product.price * (1 - product.discountPercentage / 100)
        : product.price;
        
      montant_total += item.quantité * prix_unitaire;
    }

    const orderDeliveryAddress = delivery_address || {
      firstname: user.firstname,
      lastname: user.lastname,
      address: user.address,
      zipCode: user.zipCode || "",
      country: "Tunisia",
      phone: user.phone,
    };

    const order = new Order({
      client_id: clientId,
      montant_total,
      details,
      delivery_address: orderDeliveryAddress,
    });

    // Save the order
    await order.save();

    const artisanEmails = new Set(); 
    for (let item of details) {
      const product = await Product.findById(item.produit_id);
      if (product && product.artisan) {
        const artisan = await User.findById(product.artisan);
        if (artisan && artisan.email) {
          artisanEmails.add(artisan.email); 
        }
      }
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose the email message
    const message = {
      from: process.env.EMAIL_USER,
      to: Array.from(artisanEmails).join(', '),
      subject: "New Order Notification",
      text: `A new order has been created by ${user.firstname} ${user.lastname}. Here are the details:\n\n` +
            `Total Amount: $${montant_total.toFixed(2)}\n` +
            `Delivery Address: ${JSON.stringify(orderDeliveryAddress, null, 2)}\n\n` +
            `Order Details:\n` +
            `${details.map(item => `Product Name: ${item.produit_id.name}, Quantity: ${item.quantité}`).join('\n')}`
    };

    await transporter.sendMail(message);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find() .populate({
      path: 'details.produit_id', 
     select : ""
    });;
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.find({ client_id: req.params.id })
      .populate({
        path: 'details.produit_id', 
       select : ""
      });
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderById = async (req, res) => {
  try {
    const { statut, details } = req.body;

    let montant_total = 0;

    let allAccepted = true;
    let allCanceled = true;

    if (details) {
      details.forEach((item) => {
        if (item.accepte === "accepte") {
          montant_total += item.quantité * item.prix_unitaire;
          allCanceled = false; 
        } else if (item.accepte === "annulée") {
          allAccepted = false;
        } else {
          allAccepted = false;
          allCanceled = false;
        }
      });
    }

    let updatedStatut = statut; 
    if (allAccepted) {
      updatedStatut = "livrée"; 
    } else if (allCanceled) {
      updatedStatut = "annulée"; 
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { statut: updatedStatut, details, montant_total },
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



export const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order successfully deleted' });
  } catch (err) {
    console.error('Error deleting order:', err); 
    res.status(500).json({ error: 'An error occurred while deleting the order. Please try again later.' });
  }
};



export const getOrderByIdArtisan = async (req, res) => {
  try {
    const artisanId = req.params.id;

    // Fetch products for the given artisan
    const products = await Product.find({ artisan: artisanId }).select('_id artisan');

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'Aucun produit trouvé pour cet artisan' });
    }

    const productIds = products.map(product => product._id);

    // Fetch orders containing these product IDs, sorted by newest first
    const orders = await Order.find({ 'details.produit_id': { $in: productIds } })
      .sort({ createdAt: -1 })  // Sort by `createdAt` field, descending order (-1)
      .populate({
        path: 'details.produit_id', 
        model: 'Product', 
        select: '' 
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'Aucune commande trouvée pour cet artisan' });
    }

    const artisanOrders = orders.map(order => {  
      // Filter to find all relevant details for this order
      const relevantDetails = order.details.filter(detail => {
        const productId = detail.produit_id._id;
        const isRelevant = productIds.map(id => id.toString()).includes(productId.toString());
        return isRelevant;
      }); 
    
      if (relevantDetails.length > 0) {
        return {
          ...order.toObject(),
          details: relevantDetails.map(detail => ({
            ...detail.toObject(),
            product: detail.produit_id,
          })),
        };
      }
    }).filter(order => order !== undefined);

    res.json(artisanOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getArtisanOfTheMonth = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(1);
    endOfMonth.setHours(0, 0, 0, 0);

    const topArtisans = await Order.aggregate([
      {
        $match: {
          date_commande: { $gte: startOfMonth, $lt: endOfMonth }, 
          statut: 'livrée',
        },
      },
      {
        $unwind: '$details', 
      },
      {
        $lookup: {
          from: 'products', 
          localField: 'details.produit_id',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      {
        $unwind: '$productInfo', 
      },
      {
        $match: {
          'productInfo.tracking_number': { $exists: true, $ne: null }, 
        },
      },
      {
        $group: {
          _id: '$productInfo.artisan',
          totalProducts: { $sum: '$details.quantité' }, 
        },
      },
      {
        $sort: { totalProducts: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: '_id',
          as: 'artisanDetails',
        },
      },
      {
        $unwind: '$artisanDetails', 
      },
      {
        $project: {
          artisanId: '$_id', 
          totalProducts: 1, 
          artisanName: { $concat: ['$artisanDetails.firstname', ' ', '$artisanDetails.lastname'] },
          artisanPhoto: '$artisanDetails.avatar', 
        },
      },
    ]);

    const artisanInfo = topArtisans.map(artisan => ({
      artisanId: artisan.artisanId,
      artisanName: artisan.artisanName,
      artisanPhoto: artisan.artisanPhoto,
      totalProducts: artisan.totalProducts,
    }));

    return res.status(200).json(artisanInfo);
  } catch (error) {
    console.error('Error fetching artisans of the month:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




export const getStaticOfArtisan = async (req, res) => {
  try {
    const artisanId = req.params.id; 

    // 1. Total Products by Artisan
    const totalProducts = await Product.countDocuments({ artisan: artisanId });

    // 2. Total Orders related to Artisan's Products
    const productIds = await Product.find({ artisan: artisanId }).distinct('_id');
    const totalOrders = await Order.countDocuments({
      "details.produit_id": { $in: productIds },
    });

    // 3. Total Sales: Sum of all sales for products belonging to this artisan
    const totalSales = await Order.aggregate([
      { $unwind: '$details' },
      {
        $match: {
          "details.produit_id": { $in: productIds },
          "details.accepte": "accepte",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$details.quantité', '$details.prix_unitaire'] } },
        },
      },
    ]);

    const bestSellingProducts = await Order.aggregate([
      { $unwind: '$details' },
      {
        $match: {
          "details.produit_id": { $in: productIds },
          "details.accepte": "accepte",
        },
      },
      {
        $group: {
          _id: '$details.produit_id',
          totalSold: { $sum: '$details.quantité' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $project: {
          _id: 1,
          productName: '$product.name',
          totalSold: 1,
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5, 
      },
    ]);

    const orderStatistics = await Order.aggregate([
      {
        $match: {
          "details.produit_id": { $in: productIds },
        },
      },
      {
        $group: {
          _id: '$statut',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
      bestSellingProducts,
      orderStatistics,
    });
  } catch (error) {
    console.error('Error fetching statistics for artisan:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



