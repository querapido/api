import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import * as bcrypt from "bcryptjs";
import { User } from "../../entities/User";

@Resolver(User)
export class RegisterResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello World!!";
  }

  @FieldResolver()
  async name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    // firstName inside @Arg => name in GraphQL schema
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    return user;
  }
}