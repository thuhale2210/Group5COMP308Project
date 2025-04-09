import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { buildSubgraphSchema } from '@apollo/subgraph';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import connectDB from './config/mongoose.js';
import { config } from './config/config.js';
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());

const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  introspection: true,
});

await server.start();

app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    console.log('🛡️ Received Authorization header:', authHeader);

    let user = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        user = { id: decoded.userId };
        console.log('✅ Verified user:', user);
      } catch (err) {
        console.error('❌ Token verification failed:', err);
      }
    }

    return { user };
  },
}));

app.listen(config.port, () =>
  console.log(`🚀 Business & Events Service running at http://localhost:${config.port}/graphql`)
);
