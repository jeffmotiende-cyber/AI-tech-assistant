# AI-Powered Electronics Buying Assistant - System Architecture Specification

## System Overview

The AI-Powered Electronics Buying Assistant is a MERN (MongoDB, Express.js, React, Node.js) stack web application designed to help users in Kenya make informed decisions when purchasing electronics. The system leverages AI to provide personalized recommendations based on user preferences, budget, and product specifications, while accounting for Kenyan market specifics such as KES currency, 240V 50Hz power standards, local brands, and popular e-commerce platforms like Jumia and Kilimall.

### High-Level Architecture

- **Frontend**: React application built with Vite for fast development, styled with Tailwind CSS, using React Router for navigation and Redux for state management.
- **Backend**: Node.js/Express server providing RESTful APIs, secured with JWT authentication and rate limiting.
- **Database**: MongoDB with defined schemas for users, products, brands, power specifications, marketplaces, and chat logs.
- **AI Integration**: Dedicated chat endpoint that processes user queries and generates recommendations using AI logic tailored to Kenyan electronics market.

The application follows a client-server architecture with the frontend handling user interactions, the backend managing business logic and data persistence, and AI integration providing intelligent recommendations.

## Frontend Architecture

### Technology Stack
- **Framework**: React 18+ with Vite for build tooling
- **Styling**: Tailwind CSS for responsive, utility-first styling
- **Routing**: React Router v6 for client-side navigation
- **State Management**: Redux Toolkit for global state management, with RTK Query for API interactions
- **Additional Libraries**:
  - Axios for HTTP requests
  - React Hook Form for form handling
  - React Icons for UI icons

### Component Structure
- **Pages**: Home, Product Search, Product Details, Chat Assistant, User Profile, Admin Dashboard
- **Components**: Header, Footer, ProductCard, ChatWidget, RecommendationList, FilterPanel
- **Layouts**: MainLayout, AuthLayout

### Key Features
- Responsive design optimized for mobile and desktop
- Real-time chat interface for AI interactions
- Product comparison tools
- User authentication and profile management
- Currency display in KES with automatic conversion
- Power specification filters (240V 50Hz compatibility)

## Backend Architecture

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Authentication**: JWT (JSON Web Tokens) with refresh token rotation
- **Security**: Helmet for security headers, CORS configuration, input validation with Joi
- **Rate Limiting**: Express Rate Limit middleware
- **Additional Libraries**:
  - Mongoose for MongoDB ODM
  - Bcrypt for password hashing
  - Multer for file uploads (if needed for product images)

### API Design
- RESTful API following JSON:API specification
- Versioned endpoints (e.g., /api/v1/)
- Consistent error handling and response formats
- Pagination for list endpoints

### Security Measures
- JWT-based authentication with role-based access control
- Rate limiting to prevent abuse (e.g., 100 requests per 15 minutes per IP)
- Input sanitization and validation
- HTTPS enforcement in production

## Database Design

### MongoDB Schemas

#### User Schema
```javascript
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  preferences: {
    budget: Number,
    preferred_brands: [String],
    power_requirements: String // e.g., '240V 50Hz'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

#### Product Schema
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true },
  brand: { type: ObjectId, ref: 'Brand', required: true },
  category: { type: String, required: true }, // e.g., 'smartphone', 'laptop'
  price_kes: { type: Number, required: true },
  specifications: {
    power_voltage: String, // '240V'
    power_frequency: String, // '50Hz'
    warranty: String,
    features: [String]
  },
  marketplaces: [{
    platform: { type: ObjectId, ref: 'Marketplace' },
    url: String,
    price: Number,
    availability: Boolean
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}
```

#### Brand Schema
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, unique: true },
  country: { type: String, default: 'Kenya' }, // For local vs international brands
  logo_url: String,
  description: String
}
```

#### Power_Specs Schema
```javascript
{
  _id: ObjectId,
  voltage: { type: String, required: true }, // '240V'
  frequency: { type: String, required: true }, // '50Hz'
  compatible_products: [{ type: ObjectId, ref: 'Product' }]
}
```

#### Marketplace Schema
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true }, // e.g., 'Jumia', 'Kilimall'
  base_url: { type: String, required: true },
  api_key: String, // For potential API integrations
  supported_categories: [String]
}
```

#### Chat_Logs Schema
```javascript
{
  _id: ObjectId,
  user_id: { type: ObjectId, ref: 'User', required: true },
  session_id: String,
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  recommendations: [{ type: ObjectId, ref: 'Product' }],
  created_at: { type: Date, default: Date.now }
}
```

## AI Integration

### Chat Endpoint Design
- **Endpoint**: POST /api/v1/chat
- **Input**: User message, user preferences, chat history
- **Processing**:
  1. Parse user query for intent (e.g., product search, comparison, recommendation)
  2. Query database for relevant products based on Kenyan market data
  3. Apply recommendation logic considering:
     - Budget in KES
     - Power compatibility (240V 50Hz)
     - Local brand preferences
     - Availability on Kenyan platforms
  4. Generate natural language response with product suggestions
- **AI Logic**: Custom recommendation engine that prioritizes:
  - Products compatible with Kenyan power standards
  - Local brands and distributors
  - Current prices on popular marketplaces
  - User budget constraints

### Integration Points
- External AI service (e.g., OpenAI GPT) for natural language processing
- Web scraping or API integration with Jumia, Kilimall for real-time pricing
- Currency conversion APIs if needed (though primarily KES-focused)

## API Endpoints

### Authentication
- POST /api/v1/auth/register - User registration
- POST /api/v1/auth/login - User login
- POST /api/v1/auth/refresh - Refresh JWT token
- POST /api/v1/auth/logout - User logout

### Users
- GET /api/v1/users/profile - Get user profile
- PUT /api/v1/users/profile - Update user profile
- PUT /api/v1/users/preferences - Update user preferences

### Products
- GET /api/v1/products - List products with filters (brand, category, price range, power specs)
- GET /api/v1/products/:id - Get product details
- POST /api/v1/products - Create product (admin only)
- PUT /api/v1/products/:id - Update product (admin only)
- DELETE /api/v1/products/:id - Delete product (admin only)

### Brands
- GET /api/v1/brands - List brands
- GET /api/v1/brands/:id - Get brand details

### Marketplaces
- GET /api/v1/marketplaces - List marketplaces
- GET /api/v1/marketplaces/:id - Get marketplace details

### Chat
- POST /api/v1/chat - Send chat message and get AI response
- GET /api/v1/chat/history - Get user's chat history

## Data Flow

1. **User Registration/Login**: User submits credentials → Backend validates → JWT issued → Stored in client
2. **Product Search**: Frontend sends filters → Backend queries MongoDB → Returns paginated results
3. **AI Chat**: User sends message → Backend processes with AI logic → Queries relevant data → Returns response with recommendations
4. **Recommendation Generation**: AI analyzes user preferences, chat history, and product data → Filters for Kenyan compatibility → Ranks products by relevance

## Integration Points

- **AI Service**: Integration with external AI API for chat processing
- **Marketplace APIs**: Potential integration with Jumia, Kilimall APIs for real-time data
- **Payment Gateway**: Future integration with M-Pesa or other Kenyan payment systems
- **Analytics**: Integration with Google Analytics or similar for user behavior tracking

## Kenyan Market Specifics

- **Currency**: All prices displayed and stored in KES
- **Power Standards**: Filter and recommend only 240V 50Hz compatible products
- **Local Brands**: Prioritize and highlight Kenyan brands (e.g., local smartphone brands, electronics manufacturers)
- **Marketplaces**: Integrate data from popular Kenyan platforms like Jumia, Kilimall, and local stores
- **Cultural Considerations**: UI localized for Kenyan users, including Swahili language support if needed

## Deployment and Scaling

- **Frontend**: Deployed on Vercel or Netlify with CDN
- **Backend**: Deployed on Heroku, DigitalOcean, or AWS with load balancing
- **Database**: MongoDB Atlas for cloud hosting with replica sets
- **Monitoring**: Application monitoring with tools like New Relic or Datadog
- **CI/CD**: GitHub Actions for automated testing and deployment

This architecture provides a scalable, secure, and AI-powered platform specifically tailored for the Kenyan electronics market, ensuring users receive relevant recommendations that account for local standards and preferences.