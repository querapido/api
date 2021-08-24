import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../../entities/User";
import { RegisterInput } from "./register/RegisterInput";

@Resolver()
export class RegisterResolver {
  @Query(() => String, { nullable: true })
  async hello() {
    return "Hello World!!";
  }

  // Moved to the User entity
  // @FieldResolver()
  // async name(@Root() parent: User) {
  //   return `${parent.firstName} ${parent.lastName}`;
  // }

  @Mutation(() => User)
  async register(
    // string inside @Arg => name in GraphQL schema
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
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