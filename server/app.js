const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('../database/connection');
const User = require('../database/user');
const Product = require('../database/product');
const Brand = require('../database/brand');
const Marketplace = require('../database/marketplace');
const ChatLog = require('../database/chat_log');
const jwt = require('jsonwebtoken');
const OpenAI = require('openai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Error handling middleware              
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
connectDB();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Routes

// GET /api/v1/products - Get product recommendations with filters
app.get('/api/v1/products', async (req, res) => {
  try {
    const { category, price_max, power_voltage } = req.query;

    // Basic validation
    if (!category || !price_max || !power_voltage) {
      return res.status(400).json({ error: 'Missing required query parameters: category, price_max, power_voltage' });
    }

    const budgetNum = parseFloat(price_max);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      return res.status(400).json({ error: 'price_max must be a positive number' });
    }

    // Build query
    const query = {
      category: category,
      price_kes: { $lte: budgetNum },
      'specifications.power_voltage': power_voltage
    };

    const products = await Product.find(query).populate('brand');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/marketplaces - Get Kenyan marketplaces
app.get('/api/v1/marketplaces', async (req, res) => {
  try {
    const marketplaces = await Marketplace.find({});
    res.json(marketplaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/auth/register - User registration
app.post('/api/v1/auth/register', async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    console.log('Creating user...');
    const user = new User({ name, email, password });
    await user.save();
    console.log('User created successfully');

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.log('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/auth/login - User login
app.post('/api/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/users/profile - Get user profile
app.get('/api/v1/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/v1/users/profile - Update user profile
app.put('/api/v1/users/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/v1/chat - AI chat endpoint
app.post('/api/v1/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const userId = req.user.id;

    // Get user preferences
    const user = await User.findById(userId);
    const preferences = user.preferences || {};

    // Get recent chat history (last 10 messages)
    const recentChats = await ChatLog.find({ user_id: userId }).sort({ createdAt: -1 }).limit(1);
    const chatHistory = recentChats.length > 0 ? recentChats[0].messages.slice(-10) : [];

    // Parse keywords from message (fallback)
    const parsed = parseKeywords(message);

    // Query products based on parsed and preferences
    let query = {};
    if (parsed.category) query.category = new RegExp(parsed.category, 'i');
    if (parsed.budget || preferences.budget) query.price_kes = { $lte: parsed.budget || preferences.budget };
    if (parsed.power || preferences.power_requirements) query['specifications.power_voltage'] = new RegExp((parsed.power || preferences.power_requirements), 'i');

    // Prioritize Kenyan brands and preferred brands
    const kenyanBrands = await Brand.find({ country: 'Kenya' });
    const preferredBrandNames = preferences.preferred_brands || [];
    const preferredBrands = await Brand.find({ name: { $in: preferredBrandNames } });
    const brandIds = [...kenyanBrands.map(b => b._id), ...preferredBrands.map(b => b._id)];
    if (brandIds.length > 0) {
      query.brand = { $in: brandIds };
    }

    const products = await Product.find(query).populate('brand').limit(5);

    // Update real-time prices (placeholder)
    await updateRealTimePrices(products);

    // Get marketplaces
    const marketplaces = await Marketplace.find({ supported_categories: { $in: [parsed.category] } });

    // Use OpenAI to generate response
    const systemPrompt = `You are an AI assistant for recommending electronics in Kenya. Prioritize products compatible with 240V 50Hz power standards, local Kenyan brands, and current prices. Consider user preferences: budget ${preferences.budget || 'not set'}, preferred brands ${preferredBrandNames.join(', ') || 'none'}, power requirements ${preferences.power_requirements || '240V 50Hz'}. Provide helpful, natural language responses with product recommendations.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    // Add product data to the prompt
    if (products.length > 0) {
      const productInfo = products.map(p => `${p.name} by ${p.brand.name}, ${p.price_kes} KES, power: ${p.specifications.power_voltage}`).join('; ');
      messages.push({ role: 'system', content: `Available products: ${productInfo}` });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500
    });

    const response = completion.choices[0].message.content;

    // Log interaction
    const chatLog = await ChatLog.findOneAndUpdate(
      { user_id: userId },
      {
        $push: {
          messages: [
            { role: 'user', content: message },
            { role: 'assistant', content: response }
          ]
        },
        $set: { recommendations: products.map(p => p._id) }
      },
      { upsert: true, new: true }
    );

    res.json({ response, recommendations: products.map(p => ({ id: p._id, name: p.name, price: p.price_kes, brand: p.brand.name })) });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Helper function to parse keywords (fallback for query)
function parseKeywords(message) {
  const lowerMessage = message.toLowerCase();
  let budget = null;
  let category = null;
  let power = null;

  // Extract budget (e.g., 50000 KES, KSh 30000)
  const budgetMatch = lowerMessage.match(/(\d{1,3}(?:,\d{3})*|\d+)\s*(kes|ksh)/);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1].replace(/,/g, ''));
  }

  // Extract category
  if (lowerMessage.includes('phone') || lowerMessage.includes('smartphone')) category = 'phone';
  else if (lowerMessage.includes('laptop') || lowerMessage.includes('computer')) category = 'laptop';

  // Extract power (assuming 240V)
  if (lowerMessage.includes('240v') || lowerMessage.includes('power')) power = '240V';

  return { budget, category, power };
}

// Placeholder function for real-time pricing update
// TODO: Implement web scraping or API integration with Jumia, Kilimall
async function updateRealTimePrices(products) {
  // Simulate updating prices
  for (const product of products) {
    // For now, just log
    console.log(`Updating price for ${product.name}`);
    // In real implementation, scrape or call API to get current price
    // Update product.marketplaces with new prices
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;