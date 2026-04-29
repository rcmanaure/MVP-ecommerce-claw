// ============================================
// Seed Data — Sample products for development
// ============================================

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for music lovers and remote workers.',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800',
    ],
    category: 'Electronics',
    stock: 50,
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Adjustable lumbar support, breathable mesh back, and cushioned seat. Designed for long hours of comfortable work. Supports up to 300 lbs.',
    price: 299.99,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
      'https://images.unsplash.com/photo-1505843490538-4f1e3d0d0c5b?w=800',
    ],
    category: 'Furniture',
    stock: 25,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof lid. 32oz capacity.',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    ],
    category: 'Kitchen',
    stock: 100,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keys with blue switches. Anti-ghosting, N-key rollover. Durable aluminum frame. USB-C detachable cable.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a353?w=800',
    ],
    category: 'Electronics',
    stock: 75,
  },
  {
    name: 'Cotton T-Shirt Pack',
    description: 'Pack of 3 premium cotton t-shirts in classic fit. Pre-shrunk, soft breathable fabric. Available in multiple colors. Size: L.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    ],
    category: 'Clothing',
    stock: 200,
  },
  {
    name: 'Smart Watch Fitness Tracker',
    description: 'Track heart rate, steps, sleep, and GPS. 7-day battery life. Water-resistant to 50 meters. Syncs with iOS and Android apps.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    ],
    category: 'Electronics',
    stock: 60,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 oversized 16oz mugs. Hand-crafted ceramic with ergonomic handle. Microwave and dishwasher safe. Matte finish.',
    price: 44.99,
    images: [
      'https://images.unsplash.com/photo-1514228742587-6b8b1f5f52a3?w=800',
    ],
    category: 'Kitchen',
    stock: 80,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight mesh upper with responsive cushioning. Durable rubber outsole for all terrain. Memory foam insole for comfort.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800',
    ],
    category: 'Sports',
    stock: 45,
  },
  {
    name: 'LED Desk Lamp',
    description: 'Adjustable color temperature (2700K-6500K) and brightness. USB charging port. Touch control with memory function. Flexible arm.',
    price: 59.99,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800',
    ],
    category: 'Furniture',
    stock: 90,
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm eco-friendly TPE material. Non-slip surface on both sides. Includes carrying strap. 72" x 24".',
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    ],
    category: 'Sports',
    stock: 120,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing products
  await prisma.product.deleteMany({});
  console.log('✓ Cleared existing products');

  // Insert sample products
  for (const product of sampleProducts) {
    await prisma.product.create({ data: product });
    console.log(`✓ Created: ${product.name}`);
  }

  console.log('\n✅ Seed complete!');
  console.log(`   Created ${sampleProducts.length} products`);
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });