/**
 * Products Service — API calls for product catalog
 */

const API_BASE = '/api/products';

/**
 * Mock delay to simulate network latency
 */
const mockDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock product data store
 */
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Features deep bass, crystal clear highs, and comfortable memory foam ear cushions.',
    price: 149.99,
    images: [
      'https://picsum.photos/seed/headphones/600/600',
      'https://picsum.photos/seed/headphones2/600/600',
      'https://picsum.photos/seed/headphones3/600/600',
    ],
    category: 'electronics',
    stock: 25,
    createdAt: '2026-04-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft and breathable 100% organic cotton t-shirt. Pre-shrunk, machine washable, and ethically sourced. Available in multiple colors.',
    price: 29.99,
    images: [
      'https://picsum.photos/seed/tshirt/600/600',
      'https://picsum.photos/seed/tshirt2/600/600',
    ],
    category: 'clothing',
    stock: 100,
    createdAt: '2026-04-02T10:00:00Z',
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.',
    price: 34.99,
    images: [
      'https://picsum.photos/seed/bottle/600/600',
    ],
    category: 'home',
    stock: 50,
    createdAt: '2026-04-03T10:00:00Z',
  },
  {
    id: '4',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Anti-ghosting, N-key rollover, and durable aluminum frame.',
    price: 119.99,
    images: [
      'https://picsum.photos/seed/keyboard/600/600',
      'https://picsum.photos/seed/keyboard2/600/600',
    ],
    category: 'electronics',
    stock: 15,
    createdAt: '2026-04-04T10:00:00Z',
  },
  {
    id: '5',
    name: 'Leather Minimalist Wallet',
    description: 'Slim genuine leather wallet with RFID blocking. Holds up to 8 cards plus cash. Dimensions: 4.5 x 3.5 inches.',
    price: 49.99,
    images: [
      'https://picsum.photos/seed/wallet/600/600',
    ],
    category: 'accessories',
    stock: 40,
    createdAt: '2026-04-05T10:00:00Z',
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs with unique glazes. Dishwasher and microwave safe. 12oz capacity each.',
    price: 39.99,
    images: [
      'https://picsum.photos/seed/mugs/600/600',
      'https://picsum.photos/seed/mugs2/600/600',
    ],
    category: 'home',
    stock: 30,
    createdAt: '2026-04-06T10:00:00Z',
  },
  {
    id: '7',
    name: 'Running Shoes - Air Max',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper. Ideal for road running and daily training.',
    price: 129.99,
    images: [
      'https://picsum.photos/seed/shoes/600/600',
      'https://picsum.photos/seed/shoes2/600/600',
      'https://picsum.photos/seed/shoes3/600/600',
    ],
    category: 'sports',
    stock: 20,
    createdAt: '2026-04-07T10:00:00Z',
  },
  {
    id: '8',
    name: 'Portable Phone Charger',
    description: '20000mAh power bank with fast charging support. Dual USB-C ports, LED display, and compact design.',
    price: 44.99,
    images: [
      'https://picsum.photos/seed/charger/600/600',
    ],
    category: 'electronics',
    stock: 60,
    createdAt: '2026-04-08T10:00:00Z',
  },
  {
    id: '9',
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE material, includes carrying strap.',
    price: 54.99,
    images: [
      'https://picsum.photos/seed/yogamat/600/600',
      'https://picsum.photos/seed/yogamat2/600/600',
    ],
    category: 'sports',
    stock: 35,
    createdAt: '2026-04-09T10:00:00Z',
  },
  {
    id: '10',
    name: 'Smart Watch Series X',
    description: 'Advanced fitness tracking, heart rate monitor, GPS, and 7-day battery life. Water resistant to 50 meters.',
    price: 299.99,
    images: [
      'https://picsum.photos/seed/watch/600/600',
      'https://picsum.photos/seed/watch2/600/600',
    ],
    category: 'electronics',
    stock: 10,
    createdAt: '2026-04-10T10:00:00Z',
  },
  {
    id: '11',
    name: 'Bamboo Cutting Board Set',
    description: 'Set of 3 sustainable bamboo cutting boards with juice grooves. Dishwasher safe, knife-friendly surface.',
    price: 32.99,
    images: [
      'https://picsum.photos/seed/cuttingboard/600/600',
    ],
    category: 'home',
    stock: 45,
    createdAt: '2026-04-11T10:00:00Z',
  },
  {
    id: '12',
    name: 'Denim Jacket Classic',
    description: 'Timeless denim jacket with classic fit. Button closure, chest pockets, and premium quality wash.',
    price: 89.99,
    images: [
      'https://picsum.photos/seed/denim/600/600',
      'https://picsum.photos/seed/denim2/600/600',
    ],
    category: 'clothing',
    stock: 22,
    createdAt: '2026-04-12T10:00:00Z',
  },
];

/**
 * Available categories
 */
export const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'home', name: 'Home & Kitchen' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'sports', name: 'Sports & Outdoors' },
];

/**
 * Get products with pagination, search, and filters
 * GET /api/products?page=1&limit=20&search=&category=&minPrice=&maxPrice=
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.limit - Items per page (default: 20)
 * @param {string} params.search - Search query
 * @param {string} params.category - Category filter
 * @param {number} params.minPrice - Minimum price filter
 * @param {number} params.maxPrice - Maximum price filter
 */
export async function getProducts({
  page = 1,
  limit = 20,
  search = '',
  category = '',
  minPrice = '',
  maxPrice = '',
} = {}) {
  await mockDelay();

  let filtered = [...mockProducts];

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  // Price range filter
  if (minPrice !== '') {
    filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice !== '') {
    filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const total = filtered.length;
  const pages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const end = start + limitNum;
  const data = filtered.slice(start, end);

  console.log(`[Mock Products] List: page=${pageNum}, limit=${limitNum}, total=${total}, returned=${data.length}`);

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    },
  };
}

/**
 * Get single product by ID
 * GET /api/products/:id
 * @param {string} id - Product ID
 */
export async function getProduct(id) {
  await mockDelay(400);

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    throw new Error('Product not found');
  }

  console.log(`[Mock Products] Get: ${id}`);

  return { data: product };
}

/**
 * Add item to cart (mock)
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity to add
 */
export async function addToCart(productId, quantity = 1) {
  await mockDelay(300);

  const product = mockProducts.find(p => p.id === productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  console.log(`[Mock Products] Add to cart: ${productId} x${quantity}`);

  return {
    success: true,
    message: 'Added to cart',
    productId,
    quantity,
  };
}
