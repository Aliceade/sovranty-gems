const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// @GET /api/products — with filtering, search, pagination
router.get('/', asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.page) || 1;

  const filters = {};
  if (req.query.keyword) {
    filters.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { story: { $regex: req.query.keyword, $options: 'i' } },
      { tags: { $regex: req.query.keyword, $options: 'i' } }
    ];
  }
  if (req.query.collection) filters.collection = req.query.collection;
  if (req.query.intent) filters.intent = req.query.intent;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.featured) filters.isFeatured = true;
  if (req.query.minPrice || req.query.maxPrice) {
    filters.price = {};
    if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
  }

  const sort = {};
  if (req.query.sort === 'price_asc') sort.price = 1;
  else if (req.query.sort === 'price_desc') sort.price = -1;
  else if (req.query.sort === 'newest') sort.createdAt = -1;
  else if (req.query.sort === 'rating') sort.rating = -1;
  else sort.createdAt = -1;

  const count = await Product.countDocuments(filters);
  const products = await Product.find(filters).sort(sort).limit(pageSize).skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
}));

// @GET /api/products/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true }).limit(6);
  res.json(products);
}));

// @GET /api/products/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Piece not found in the Vault.' });
  res.json(product);
}));

// @GET /api/products/slug/:slug
router.get('/slug/:slug', asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: 'Piece not found.' });
  res.json(product);
}));

// @POST /api/products — Admin only
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
}));

// @PUT /api/products/:id — Admin only
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Piece not found.' });
  res.json(product);
}));

// @DELETE /api/products/:id — Admin only
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Piece removed from the Vault.' });
}));

// @POST /api/products/:id/reviews
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this acquisition.' });

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Testimonial recorded.' });
}));

module.exports = router;