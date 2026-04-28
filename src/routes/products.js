// ============================================
// Product Routes — CRUD operations for product catalog
// ============================================

const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const prisma = require('../config/prisma');

const router = express.Router();

// --------------------------------------------
// GET /api/products — List products with pagination, search, filter
// --------------------------------------------
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
    } = req.query;

    // Parse and validate pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    // Search by name (case-insensitive)
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by category (exact match)
    if (category) {
      where.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Execute count and find in parallel
    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const pages = Math.ceil(total / limitNum);

    res.json({
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages,
      },
    });
  } catch (error) {
    console.error('List products error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch products.',
      },
    });
  }
});

// --------------------------------------------
// GET /api/products/:id — Get single product
// --------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found.',
        },
      });
    }

    res.json({ data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch product.',
      },
    });
  }
});

// --------------------------------------------
// POST /api/products — Create product (admin only)
// --------------------------------------------
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, images, category, stock } = req.body;

    // Validation
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, description, price, and category are required.',
        },
      });
    }

    // Parse and validate price
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Price must be a non-negative number.',
        },
      });
    }

    // Parse and validate stock
    const stockNum = parseInt(stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Stock must be a non-negative integer.',
        },
      });
    }

    // Validate images array if provided
    let imagesArray = [];
    if (images) {
      if (!Array.isArray(images)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Images must be an array of URLs.',
          },
        });
      }
      imagesArray = images;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: priceNum,
        images: imagesArray,
        category,
        stock: stockNum,
      },
    });

    res.status(201).json({ data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create product.',
      },
    });
  }
});

// --------------------------------------------
// PUT /api/products/:id — Update product (admin only)
// --------------------------------------------
router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, images, category, stock } = req.body;

    // Check product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found.',
        },
      });
    }

    // Build update data
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Price must be a non-negative number.',
          },
        });
      }
      updateData.price = priceNum;
    }
    if (images !== undefined) {
      if (!Array.isArray(images)) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Images must be an array of URLs.',
          },
        });
      }
      updateData.images = images;
    }
    if (category !== undefined) updateData.category = category;
    if (stock !== undefined) {
      const stockNum = parseInt(stock, 10);
      if (isNaN(stockNum) || stockNum < 0) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Stock must be a non-negative integer.',
          },
        });
      }
      updateData.stock = stockNum;
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    res.json({ data: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update product.',
      },
    });
  }
});

// --------------------------------------------
// DELETE /api/products/:id — Delete product (admin only)
// --------------------------------------------
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Check product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Product not found.',
        },
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      data: {
        message: 'Product deleted successfully.',
        id,
      },
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete product.',
      },
    });
  }
});

module.exports = router;