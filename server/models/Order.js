const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Legacy Log entry number
  legacyRef: { type: String, unique: true },
  
  orderItems: [orderItemSchema],

  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
  },

  paymentMethod: { type: String, required: true, default: 'Stripe' },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },

  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  taxPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },

  status: {
    type: String,
    enum: ['Awaiting Payment', 'Confirmed', 'In Preparation', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Awaiting Payment'
  },

  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,

  // Acquisition note — personal message
  giftMessage: String,
  isGift: { type: Boolean, default: false }
}, { timestamps: true });

// Auto-generate legacy ref
orderSchema.pre('save', function (next) {
  if (!this.legacyRef) {
    this.legacyRef = 'SG-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 5).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);