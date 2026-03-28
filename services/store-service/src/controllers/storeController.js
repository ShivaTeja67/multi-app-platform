const mockProducts = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    rating: 4.5,
    reviews: 234,
    inStock: true
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with cherry MX switches',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1587829191301-72f86f2e0dac?w=400',
    category: 'Electronics',
    rating: 4.7,
    reviews: 456,
    inStock: true
  },
  {
    id: '3',
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with 1050MB/s read speed',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400',
    category: 'Storage',
    rating: 4.6,
    reviews: 312,
    inStock: true
  },
  {
    id: '4',
    name: '4K Webcam',
    description: 'Professional 4K webcam with auto-focus and built-in microphone',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    category: 'Electronics',
    rating: 4.4,
    reviews: 189,
    inStock: true
  },
  {
    id: '5',
    name: 'USB-C Hub 10-in-1',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400',
    category: 'Accessories',
    rating: 4.3,
    reviews: 267,
    inStock: true
  },
  {
    id: '6',
    name: 'Laptop Stand Aluminum',
    description: 'Adjustable aluminum laptop stand for laptops up to 17"',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    category: 'Accessories',
    rating: 4.5,
    reviews: 503,
    inStock: true
  },
  {
    id: '7',
    name: 'Wireless Mouse Pro',
    description: 'Ergonomic wireless mouse with precision tracking',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400',
    category: 'Accessories',
    rating: 4.2,
    reviews: 421,
    inStock: true
  },
  {
    id: '8',
    name: 'Monitor Light Bar',
    description: 'USB-powered monitor light bar for reduced eye strain',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1595318549075-bf2c8e572608?w=400',
    category: 'Lighting',
    rating: 4.6,
    reviews: 178,
    inStock: true
  },
  {
    id: '9',
    name: 'Mechanical Keyboard Switches',
    description: 'Set of 120 Cherry MX switches in various colors',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1587829191301-72f86f2e0dac?w=400',
    category: 'Accessories',
    rating: 4.8,
    reviews: 234,
    inStock: true
  }
];

// In-memory cart storage: { userId: { productId: quantity, ... } }
const userCarts = {};

export const getProducts = (req, res) => {
  res.json(mockProducts);
};

export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
};

export const getCart = (req, res) => {
  const userId = req.user.userId;
  const cart = userCarts[userId] || {};

  // Build cart with product details
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = mockProducts.find(p => p.id === productId);
    return {
      productId,
      quantity,
      product,
      subtotal: product ? product.price * quantity : 0
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  res.json({
    items: cartItems,
    total: parseFloat(total.toFixed(2))
  });
};

export const addToCart = (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }

  const product = mockProducts.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!userCarts[userId]) {
    userCarts[userId] = {};
  }

  userCarts[userId][productId] = (userCarts[userId][productId] || 0) + parseInt(quantity);

  res.json({
    message: 'Item added to cart',
    productId,
    quantity: userCarts[userId][productId]
  });
};

export const updateCartItem = (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID required' });
  }

  if (!userCarts[userId] || !userCarts[userId][productId]) {
    return res.status(404).json({ error: 'Item not in cart' });
  }

  if (quantity <= 0) {
    delete userCarts[userId][productId];
  } else {
    userCarts[userId][productId] = parseInt(quantity);
  }

  res.json({ message: 'Cart updated' });
};

export const removeFromCart = (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  if (!userCarts[userId] || !userCarts[userId][productId]) {
    return res.status(404).json({ error: 'Item not in cart' });
  }

  delete userCarts[userId][productId];

  res.json({ message: 'Item removed from cart' });
};

export const clearCart = (req, res) => {
  const userId = req.user.userId;
  userCarts[userId] = {};
  res.json({ message: 'Cart cleared' });
};
