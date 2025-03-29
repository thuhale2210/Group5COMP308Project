import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";
import cors from "cors";
import cookieParser from "cookie-parser";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Custom Data Source to forward headers
class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.token) {
      console.log("✅ Setting Authorization header:", context.token);
      request.http.headers.set("authorization", `Bearer ${context.token}`);
    }
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "auth-service", url: "http://localhost:4001/graphql" },
      { name: "community-engagement-service", url: "http://localhost:4002/graphql" },
    ],
  }),
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  introspection: true,
  plugins: [
    {
      async requestDidStart() {
        return {
          async willSendRequest({ request, context }) {
            if (context.token) {
              request.http.headers.set("authorization", `Bearer ${context.token}`);
              console.log("✅ Forwarding token to subgraph:", context.token); // Add this log
            } else {
              console.warn("❌ No token found in context at gateway!");
            }
          }
        };
      }
    }
  ]
});


async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.cookies?.token;
        return { token };
      },
      plugins: [
        {
          async requestDidStart() {
            return {
              async willSendRequest({ request, context }) {
                if (context.token) {
                  request.http.headers.set('authorization', `Bearer ${context.token}`);
                }
              }
            };
          }
        }
      ]
    })
  );

  app.listen(4000, () => {
    console.log("🚀 Gateway running at http://localhost:4000/graphql");
  });
}

startServer();
