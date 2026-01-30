# AI-Powered Electronics Buying Assistant

A MERN stack web application designed to help users in Kenya make informed decisions when purchasing electronics. The system leverages AI to provide personalized recommendations based on user preferences, budget, and product specifications, while accounting for Kenyan market specifics such as KES currency, 240V 50Hz power standards, local brands, and popular e-commerce platforms like Jumia and Kilimall.

## Project Structure

- `client/`: React frontend built with Vite, styled with Tailwind CSS
- `server/`: Node.js/Express backend providing RESTful APIs
- `database/`: MongoDB models and connection setup

## Technology Stack

- **Frontend**: React 18+, Vite, Tailwind CSS, Redux Toolkit, Axios
- **Backend**: Node.js, Express.js, JWT, Mongoose
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB

### Installation

1. Clone the repository
2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install server dependencies:
   ```bash
   cd ../server
   npm install
   ```
4. Set up environment variables (create .env files in client and server directories)
5. Start the development servers:
   - Client: `npm run dev` in client directory
   - Server: `npm run dev` in server directory

## Features

- AI-powered chat assistant for product recommendations
- Product search and filtering
- User authentication and profiles
- Currency display in KES
- Power specification compatibility checks (240V 50Hz)
- Integration with Kenyan marketplaces

## Contributing

Please read the architecture specification in `plans/architecture_spec.md` for detailed system design.