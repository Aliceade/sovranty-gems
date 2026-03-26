const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  
  // The 'Collection' — e.g., "The Heirloom Protocol"
  collection: {
    type: String,
    required: true,
    enum: ['The Heirloom Protocol', 'Sovereign Blooms', 'The Obsidian Decree', 'Celestial Conquest', 'The Crimson Covenant'],
  },

  // Shop by Intent
  intent: {
    type: String,
    enum: ['Power', 'Romance', 'Legacy', 'Devotion', 'Rebellion'],
    required: true
  },

  category: {
    type: String,
    required: true,
    enum: ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Brooches', 'Sets']
  },

  // Editorial storytelling description
  story: { type: String, required: true },
  
  // Short tagline for cards
  tagline: { type: String, required: true },

  // Material/spec details
  materials: [{ type: String }],
  stones: [{ name: String, carat: Number, origin: String }],
  metalType: String,
  weight: String,
  dimensions: String,

  price: { type: Number, required: true, default: 0 },
  compareAtPrice: { type: Number },
  
  // High-res image array
  images: [{
    url: { type: String, required: true },
    publicId: String,
    alt: String,
    isCover: { type: Boolean, default: false }
  }],

  countInStock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isExclusive: { type: Boolean, default: false }, // Limited pieces
  
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

  tags: [String],
  slug: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);