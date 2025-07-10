import { Product } from '../types';

export const products: Product[] = [
  // 0-6 Months Products
  {
    id: 'smart-bottle-001',
    name: 'NeoFeed Smart Bottle',
    price: 24975, // 89.99 * 277.5
    originalPrice: 30525, // 109.99 * 277.5
    category: '0-6-months',
    description: 'Revolutionary smart feeding bottle with temperature control and feeding tracking via our MiniWorld app.',
    features: [
      'Temperature monitoring and alerts',
      'Feeding time and volume tracking',
      'Anti-colic advanced nipple design',
      'BPA-free premium materials',
      'Wireless charging base included'
    ],
    images: [
      'https://images.unsplash.com/photo-1566479179817-00b7b49fad44?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1520017788502-6d8d5c77b56e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.8,
    reviews: 156,
    isNew: true,
    isFeatured: true,
    stockQuantity: 45,
    lowStockThreshold: 10,
    maxStockQuantity: 100,
    stockStatus: 'in_stock',
  },
  {
    id: 'cyber-swaddle-001',
    name: 'CyberSwaddle Pro',
    price: 16650, // 59.99 * 277.5
    category: '0-6-months',
    description: 'Next-generation smart swaddle with integrated sleep monitoring and gentle vibration comfort.',
    features: [
      'Sleep pattern monitoring',
      'Gentle vibration comfort',
      'Breathable smart fabric',
      'Easy velcro adjustment',
      'Machine washable'
    ],
    images: [
      'https://images.unsplash.com/photo-1559593043-e3cf3cd23ba4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517417000841-ce6ad7f37028?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.6,
    reviews: 89,
    isFeatured: true,
    stockQuantity: 8,
    lowStockThreshold: 10,
    maxStockQuantity: 50,
    stockStatus: 'low_stock',
  },
  {
    id: 'holo-mobile-001',
    name: 'HoloMobile Projector',
    price: 36075, // 129.99 * 277.5
    category: '0-6-months',
    description: 'Mesmerizing holographic mobile that projects soothing patterns and plays calming sounds.',
    features: [
      '3D holographic projections',
      '12 soothing sound modes',
      'Motion sensor activation',
      'Remote control included',
      'Timer settings available'
    ],
    images: [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564533322166-638b3e34e50e?w=400&h=400&fit=crop',
    ],
    inStock: false,
    rating: 4.9,
    reviews: 234,
    isNew: true,
    stockQuantity: 0,
    lowStockThreshold: 5,
    maxStockQuantity: 30,
    stockStatus: 'out_of_stock',
  },
  
  // 6-12 Months Products
  {
    id: 'crawl-tracker-001',
    name: 'CrawlTracker Activity Mat',
    price: 41625, // 149.99 * 277.5
    category: '6-12-months',
    description: 'Interactive play mat with built-in sensors to track your baby\'s movement and development milestones.',
    features: [
      'Movement tracking sensors',
      'Interactive light patterns',
      'Development milestone alerts',
      'Easy-clean surface',
      'Foldable design'
    ],
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.7,
    reviews: 178,
    isFeatured: true,
    stockQuantity: 25,
    lowStockThreshold: 8,
    maxStockQuantity: 60,
    stockStatus: 'in_stock',
  },
  {
    id: 'neural-teether-001',
    name: 'NeuroTeether Sensory Toy',
    price: 11100, // 39.99 * 277.5
    category: '6-12-months',
    description: 'Advanced teething toy with multiple textures and gentle LED feedback for sensory development.',
    features: [
      'Multiple texture zones',
      'Gentle LED light feedback',
      'Cooling gel inserts',
      'Easy grip design',
      'Food-grade silicone'
    ],
    images: [
      'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.5,
    reviews: 112,
    stockQuantity: 3,
    lowStockThreshold: 5,
    maxStockQuantity: 40,
    stockStatus: 'low_stock',
  },
  
  // 1-3 Years Products
  {
    id: 'quantum-walker-001',
    name: 'QuantumWalk Learning Walker',
    price: 55500, // 199.99 * 277.5
    originalPrice: 63825, // 229.99 * 277.5
    category: '1-3-years',
    description: 'Revolutionary walking assistant with AI-powered balance support and interactive learning activities.',
    features: [
      'AI balance assistance',
      'Interactive learning center',
      'Height adjustable',
      'Safety brake system',
      'Parent remote control'
    ],
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.8,
    reviews: 298,
    isFeatured: true,
    stockQuantity: 12,
    lowStockThreshold: 5,
    maxStockQuantity: 25,
    stockStatus: 'in_stock',
  },
  {
    id: 'holo-blocks-001',
    name: 'HoloBlocks Building Set',
    price: 22200, // 79.99 * 277.5
    category: '1-3-years',
    description: 'Magnetic building blocks with holographic projections that teach shapes, colors, and creativity.',
    features: [
      'Magnetic connections',
      'Holographic projections',
      'Educational app integration',
      'Safe rounded edges',
      '50 pieces included'
    ],
    images: [
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564533322166-638b3e34e50e?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.6,
    reviews: 145,
    isNew: true,
    stockQuantity: 18,
    lowStockThreshold: 10,
    maxStockQuantity: 50,
    stockStatus: 'in_stock',
  },
  
  // 3-5 Years Products
  {
    id: 'ar-learning-001',
    name: 'AR Learning Tablet',
    price: 83250, // 299.99 * 277.5
    category: '3-5-years',
    description: 'Child-safe tablet with augmented reality learning experiences designed for preschoolers.',
    features: [
      'Augmented reality games',
      'Educational content library',
      'Parent controls',
      'Shockproof case',
      'Blue light filter'
    ],
    images: [
      'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564533322166-638b3e34e50e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.9,
    reviews: 567,
    isFeatured: true,
    stockQuantity: 6,
    lowStockThreshold: 8,
    maxStockQuantity: 20,
    stockStatus: 'low_stock',
  },
  {
    id: 'cyber-bike-001',
    name: 'CyberRide Balance Bike',
    price: 49950, // 179.99 * 277.5
    category: '3-5-years',
    description: 'Smart balance bike with LED lights and built-in safety features for the next generation riders.',
    features: [
      'LED light system',
      'Safety brake sensors',
      'Adjustable seat height',
      'Puncture-proof tires',
      'Parent monitoring app'
    ],
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    ],
    inStock: true,
    rating: 4.7,
    reviews: 89,
    stockQuantity: 15,
    lowStockThreshold: 6,
    maxStockQuantity: 35,
    stockStatus: 'in_stock',
  }
]; 