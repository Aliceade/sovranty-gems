const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const https = require('https');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Helper: verify Paystack transaction server-side
const verifyPaystack = (reference) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${encodeURIComponent(reference)}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.end();
  });
};

// @POST /api/orders
router.post('/', protect, asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, shippingPrice, taxPrice, totalPrice,
    giftMessage, isGift
  } = req.body;

  if (!orderItems || orderItems.length === 0)
    return res.status(400).json({ message: 'No items in acquisition.' });

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'Paystack',
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    giftMessage,
    isGift,
  });

  res.status(201).json(order);
}));

// @GET /api/orders/my-legacy
router.get('/my-legacy', protect, asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate('orderItems.product', 'name images slug');
  res.json(orders);
}));

// @GET /api/orders/:id
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images slug');

  if (!order) return res.status(404).json({ message: 'Acquisition record not found.' });

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) return res.status(403).json({ message: 'Access denied.' });

  res.json(order);
}));

// @PUT /api/orders/:id/pay  —  called after Paystack callback with reference
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  const { reference } = req.body;
  if (!reference) return res.status(400).json({ message: 'Paystack reference required.' });

  // Verify with Paystack servers
  const verification = await verifyPaystack(reference);

  if (!verification.status || verification.data?.status !== 'success') {
    return res.status(400).json({ message: 'Payment verification failed. Contact support.' });
  }

  // Verify amount matches (Paystack returns in kobo)
  const paidAmountNaira = verification.data.amount / 100;
  if (paidAmountNaira < order.totalPrice - 1) {
    return res.status(400).json({ message: 'Payment amount mismatch.' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = 'Confirmed';
  order.paymentResult = {
    id: verification.data.id,
    status: verification.data.status,
    reference: verification.data.reference,
    update_time: verification.data.paid_at,
    email_address: verification.data.customer?.email,
    channel: verification.data.channel,
    currency: verification.data.currency,
  };

  const updated = await order.save();
  res.json(updated);
}));

// @GET /api/orders — Admin
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  res.json(orders);
}));

// @PUT /api/orders/:id/status — Admin
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found.' });

  order.status = req.body.status;
  if (req.body.status === 'Delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }
  const updated = await order.save();
  res.json(updated);
}));

module.exports = router;