const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const users = [
  {
    name: 'The Sovereign Admin',
    email: 'admin@sovrantygems.com',
    password: 'sovranty2024',
    role: 'admin',
  },
  {
    name: 'Lady Aurelia',
    email: 'aurelia@example.com',
    password: 'password123',
    role: 'sovereign',
  },
];

// Prices in Nigerian Naira (NGN)
const products = [
  {
    name: 'The Crimson Throne Ring',
    collection: 'The Crimson Covenant',
    intent: 'Power',
    category: 'Rings',
    tagline: 'Worn by those who command rooms.',
    story: `This ring was not designed—it was decreed. Cast from 18-karat rose gold and set with a Burmese ruby that carries the weight of dynasties, the Crimson Throne Ring is a declaration. The stone pulses with an inner fire, a 4.2-carat oval cut ruby surrounded by a micro-pavé of white diamonds that orbit it like courtiers around a queen. To wear it is to understand the difference between being seen and being remembered.`,
    materials: ['18k Rose Gold', 'Rhodium Plating'],
    stones: [
      { name: 'Burmese Ruby', carat: 4.2, origin: 'Myanmar' },
      { name: 'White Diamonds', carat: 0.8, origin: 'Botswana' },
    ],
    metalType: '18k Rose Gold',
    weight: '8.2g',
    price: 28500000,
    compareAtPrice: 32000000,
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', alt: 'Crimson Throne Ring front view', isCover: true },
      { url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800', alt: 'Ring detail' },
    ],
    countInStock: 3,
    isFeatured: true,
    isExclusive: true,
    slug: 'the-crimson-throne-ring',
    tags: ['ruby', 'rose gold', 'power ring', 'statement'],
  },
  {
    name: 'The Oracle Pendant',
    collection: 'The Obsidian Decree',
    intent: 'Legacy',
    category: 'Necklaces',
    tagline: 'The future belongs to those who adorn it.',
    story: `Some pieces carry energy. The Oracle Pendant carries prophecy. A teardrop-cut black diamond — 3.8 carats of pure geological mystery — hangs from a 24-inch chain of alternating black rhodium and polished platinum links. The pendant captures light in a way that defies physics: absorbing it, hoarding it, then releasing it slowly. Ancient cultures believed black diamonds fell from the sky. We believe them.`,
    materials: ['Platinum', 'Black Rhodium'],
    stones: [{ name: 'Black Diamond', carat: 3.8, origin: 'Brazil' }],
    metalType: 'Platinum',
    weight: '12.4g',
    price: 48500000,
    images: [
      { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800', alt: 'Oracle Pendant worn', isCover: true },
      { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800', alt: 'Pendant close-up' },
    ],
    countInStock: 2,
    isFeatured: true,
    isExclusive: true,
    slug: 'the-oracle-pendant',
    tags: ['black diamond', 'platinum', 'pendant', 'legacy'],
  },
  {
    name: 'Heirloom Sovereign Bracelet',
    collection: 'The Heirloom Protocol',
    intent: 'Legacy',
    category: 'Bracelets',
    tagline: 'For wrists that have always known their worth.',
    story: `The Heirloom Sovereign Bracelet exists at the intersection of time and devotion. Hand-crafted over 64 hours by our master atelier in Lagos, each link is individually set with alternating Colombian emeralds and G-color diamonds. The clasp mechanism — an original design we call the 'Coronation Clasp' — requires intention to open and close, ensuring this piece is never lost, only passed down.`,
    materials: ['22k Yellow Gold'],
    stones: [
      { name: 'Colombian Emerald', carat: 6.0, origin: 'Colombia' },
      { name: 'Diamond', carat: 4.5, origin: 'South Africa' },
    ],
    metalType: '22k Yellow Gold',
    weight: '28g',
    price: 68500000,
    images: [
      { url: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800', alt: 'Heirloom Bracelet on wrist', isCover: true },
    ],
    countInStock: 1,
    isFeatured: true,
    isExclusive: true,
    slug: 'heirloom-sovereign-bracelet',
    tags: ['emerald', 'gold', 'bracelet', 'heirloom'],
  },
  {
    name: 'Celestial Drop Earrings',
    collection: 'Celestial Conquest',
    intent: 'Romance',
    category: 'Earrings',
    tagline: 'Stars that chose to fall for you.',
    story: `There is a softness to power, and these earrings embody it perfectly. The Celestial Drop Earrings cascade from a 0.5-carat marquise diamond stud into a constellation of graduated tanzanite drops, each one capturing a different shade of violet twilight. The movement as they catch the light recalls a distant galaxy — structured chaos, controlled beauty.`,
    materials: ['18k White Gold'],
    stones: [
      { name: 'Diamond', carat: 1.0, origin: 'Botswana' },
      { name: 'Tanzanite', carat: 3.2, origin: 'Tanzania' },
    ],
    metalType: '18k White Gold',
    weight: '6.8g',
    price: 19500000,
    images: [
      { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800', alt: 'Celestial Earrings', isCover: true },
    ],
    countInStock: 5,
    isFeatured: false,
    slug: 'celestial-drop-earrings',
    tags: ['tanzanite', 'earrings', 'celestial', 'romance'],
  },
  {
    name: 'The Devotion Solitaire',
    collection: 'Sovereign Blooms',
    intent: 'Devotion',
    category: 'Rings',
    tagline: 'A promise beyond language.',
    story: `We do not sell engagement rings. We architect moments of permanent devotion. The Devotion Solitaire is built around a D-color, VVS1 clarity round brilliant diamond of 2.5 carats — a stone so pure it seems to contain light rather than simply reflect it. The six-prong platinum setting lifts the stone high, a cathedral mounting that says: this matters, you matter, this moment matters. Arrives in our Vault Box with a Certificate of Authenticity and a blank Legacy Card for your words.`,
    materials: ['Platinum 950'],
    stones: [{ name: 'Round Brilliant Diamond', carat: 2.5, origin: 'Botswana' }],
    metalType: 'Platinum 950',
    weight: '5.6g',
    price: 42500000,
    images: [
      { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800', alt: 'Devotion Solitaire', isCover: true },
    ],
    countInStock: 4,
    isFeatured: true,
    slug: 'the-devotion-solitaire',
    tags: ['diamond', 'solitaire', 'engagement', 'devotion', 'platinum'],
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✦ Connected to MongoDB…');

  await User.deleteMany();
  await Product.deleteMany();
  await Order.deleteMany();
  console.log('✦ Existing data cleared.');

  const createdUsers = await User.create(users);
  console.log(`✦ ${createdUsers.length} sovereigns seeded.`);

  const createdProducts = await Product.create(products);
  console.log(`✦ ${createdProducts.length} pieces added to the Vault.`);

  console.log('\n✦ Admin credentials:');
  console.log('  Email:    admin@sovrantygems.com');
  console.log('  Password: sovranty2024\n');

  console.log('✦ The Vault is stocked. Sovereign experience ready.');
  process.exit();
};

seedDB().catch(err => { console.error(err); process.exit(1); });