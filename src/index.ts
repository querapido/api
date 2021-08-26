import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const main = async () => {
  const port = process.env.PORT;

  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver]
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      })
    ]
  });

  await apolloServer.start();

  const app = Express();

  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redis
      }),
      // TODO: move to env
      name: "qid",
      // TODO: move to env
      secret: "asdfg",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000"
  }

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(port, () => {
    console.log("server started on http://localhost:4000");
  });
};

main();