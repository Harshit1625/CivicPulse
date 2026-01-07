import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import dotenv from "dotenv";
import schema from "./graphql/schema.js";
import resolver from "./graphql/resolvers.js";
import http from "http";
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

//expose it to other routes
app.set("io", io);

app.use(cors(), express.json());

const dbURL = process.env.DB_URL;
const dbKey = process.env.DB_SERVICE_ROLE_KEY;

const dbClient = createClient(dbURL, dbKey);
if (dbClient) {
  console.log("DB Connected !");
}

function getSupabase(jwt) {
  return createClient(dbURL, dbKey, {
    global: {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : "",
      },
    },
  });
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
});

async function startServer() {
  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        const jwt = token.replace("Bearer ", "");

        const supabase = getSupabase(jwt);

        let user = null;
        if (jwt) {
          const userData = await supabase.auth.getUser();
          user = userData?.data;
        }

        return { supabase, user, io };
      },
    })
  );

  io.on("connection", (socket) => {
    console.log("Connection established!");

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });

  httpServer.listen(process.env.PORT, () => {
    console.log("Server Instantiated on " + process.env.PORT);
  });
}

startServer();
