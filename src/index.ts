import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema, Query, Resolver } from "type-graphql";

@Resolver()
class HelloResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello World!";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [HelloResolver]
  });

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000");
  });
};

main();