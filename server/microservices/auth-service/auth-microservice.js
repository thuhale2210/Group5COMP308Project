import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import { config } from './config/config.js';
import { typeDefs } from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import User from './models/User.js';

connectDB();

const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000', 'https://studio.apollographql.com'],
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({
  schema,
  introspection: true,
});

async function startServer() {
  await server.start();

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];
      console.log("🔐 Received header authorization:", authHeader);

      let user = null;
      if (token) {
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET);
          if (decoded.userId) {
            user = await User.findById(decoded.userId);
            console.log("👤 user fetched from DB:", user);
          }
        } catch (error) {
          console.error("❌ Token verification failed:", error);
        }
      }

      return { user, req, res };
    }
  }));

  app.listen(config.port, () => {
    console.log(`🚀 Auth Microservice running at http://localhost:${config.port}/graphql`);
  });
}

startServer();
