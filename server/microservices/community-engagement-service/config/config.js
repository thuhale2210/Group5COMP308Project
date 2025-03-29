import dotenv from 'dotenv';
dotenv.config();
// Configuration for product-service
export const config = {
  db: process.env.PRODUCT_MONGO_URI || 'mongodb://localhost:27017/communityDB',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
  port: process.env.COMMUNITY_PORT || 4002,
};

// Log in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log(`🚀 Community Microservice running on port: ${config.port}`);
}
