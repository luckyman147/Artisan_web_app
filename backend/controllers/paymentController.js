import Payment from '../models/Payment.js';
 
export const getAllPayments = async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
};

export const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).send('Payment not found');
  res.json(payment);
};

export const createPayment = async (req, res) => {
  const newPayment = new Payment(req.body);
  await newPayment.save();
  res.status(201).json(newPayment);
};

export const updatePayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!payment) return res.status(404).send('Payment not found');
  res.json(payment);
};

export const deletePayment = async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) return res.status(404).send('Payment not found');
  res.json({ message: 'Payment deleted' });
};
