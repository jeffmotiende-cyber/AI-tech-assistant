const mongoose = require('mongoose');
const connectDB = require('../database/connection');
const Brand = require('../database/brand');
const Marketplace = require('../database/marketplace');
const Product = require('../database/product');
const PowerSpec = require('../database/power_spec');

require('dotenv').config({ path: '../.env' });

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Brand.deleteMany({});
    await Marketplace.deleteMany({});
    await Product.deleteMany({});
    await PowerSpec.deleteMany({});

    // Insert Brands
    const brands = await Brand.insertMany([
      { name: 'Samsung', reliabilityScore: 8, availabilityInKenya: true },
      { name: 'HP', reliabilityScore: 7, availabilityInKenya: true },
      { name: 'Techno', reliabilityScore: 6, availabilityInKenya: true },
      { name: 'Dell', reliabilityScore: 7, availabilityInKenya: true },
      { name: 'Hisense', reliabilityScore: 6, availabilityInKenya: true },
      { name: 'LG', reliabilityScore: 8, availabilityInKenya: true }
    ]);

    const brandMap = {};
    brands.forEach(brand => {
      brandMap[brand.name] = brand._id;
    });

    // Insert Marketplaces
    const marketplaces = await Marketplace.insertMany([
      {
        name: 'Jumia',
        base_url: 'https://jumia.co.ke',
        supported_categories: ['electronics', 'phones', 'laptops', 'tvs', 'fridges']
      },
      {
        name: 'Kilimall',
        base_url: 'https://kilimall.co.ke',
        supported_categories: ['electronics', 'phones', 'laptops', 'tvs', 'fridges']
      },
      {
        name: 'Masoko',
        base_url: 'https://masoko.com',
        supported_categories: ['electronics', 'phones', 'laptops']
      },
      {
        name: 'Sky.Garden',
        base_url: 'https://sky.garden',
        supported_categories: ['electronics', 'phones', 'laptops', 'tvs']
      }
    ]);

    // Insert Power Specs
    await PowerSpec.insertMany([
      {
        category: 'smartphone',
        standardVoltage: '240V',
        standardWattage: '50Hz',
        compatibilityNotes: 'Compatible with Kenyan power standards'
      },
      {
        category: 'laptop',
        standardVoltage: '240V',
        standardWattage: '50Hz',
        compatibilityNotes: 'Compatible with Kenyan power standards'
      },
      {
        category: 'tv',
        standardVoltage: '240V',
        standardWattage: '50Hz',
        compatibilityNotes: 'Compatible with Kenyan power standards'
      },
      {
        category: 'fridge',
        standardVoltage: '240V',
        standardWattage: '50Hz',
        compatibilityNotes: 'Compatible with Kenyan power standards'
      }
    ]);

    // Insert Products
    await Product.insertMany([
      // Phones
      {
        name: 'Samsung Galaxy A54',
        category: 'phone',
        brand: brandMap['Samsung'],
        price_kes: 45000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['calls', 'internet browsing', 'social media', 'gaming'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/samsung-galaxy-a54' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/samsung-galaxy-a54' }]
      },
      {
        name: 'Techno Camon 20',
        category: 'phone',
        brand: brandMap['Techno'],
        price_kes: 25000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['calls', 'internet', 'camera', 'budget gaming'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/techno-camon-20' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/techno-camon-20' }]
      },
      // Laptops
      {
        name: 'HP Pavilion 14',
        category: 'laptop',
        brand: brandMap['HP'],
        price_kes: 85000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['office work', 'studying', 'web browsing', 'light gaming'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/hp-pavilion-14' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/hp-pavilion-14' }]
      },
      {
        name: 'Dell Inspiron 15',
        category: 'laptop',
        brand: brandMap['Dell'],
        price_kes: 95000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['business', 'programming', 'multimedia'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/dell-inspiron-15' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/dell-inspiron-15' }]
      },
      // TVs
      {
        name: 'Samsung 43" UHD TV',
        category: 'tv',
        brand: brandMap['Samsung'],
        price_kes: 65000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['watching movies', 'news', 'sports', 'family entertainment'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/samsung-43-uhd-tv' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/samsung-43-uhd-tv' }]
      },
      {
        name: 'Hisense 32" HD TV',
        category: 'tv',
        brand: brandMap['Hisense'],
        price_kes: 35000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['budget entertainment', 'news', 'cooking shows'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/hisense-32-hd-tv' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/hisense-32-hd-tv' }]
      },
      // Home Appliances
      {
        name: 'LG Double Door Fridge',
        category: 'home appliance',
        brand: brandMap['LG'],
        price_kes: 120000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '2 years', features: ['food storage', 'beverages', 'kitchen organization'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/lg-double-door-fridge' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/lg-double-door-fridge' }]
      },
      {
        name: 'Hisense Single Door Fridge',
        category: 'home appliance',
        brand: brandMap['Hisense'],
        price_kes: 55000,
        specifications: { power_voltage: '240V', power_frequency: '50Hz', warranty: '1 year', features: ['small family food storage', 'budget cooling'] },
        marketplaces: [{ platform: marketplaces.find(m => m.name === 'Jumia')._id, url: 'https://jumia.co.ke/hisense-single-door-fridge' }, { platform: marketplaces.find(m => m.name === 'Kilimall')._id, url: 'https://kilimall.co.ke/hisense-single-door-fridge' }]
      }
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();