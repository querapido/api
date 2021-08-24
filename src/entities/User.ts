import { Field, ID, ObjectType, Root } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

// make the User class available as a GraphQL type
@ObjectType()
@Entity()
export class User extends BaseEntity {
  // Field() exposes this field (users can query it)
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  // GraphQL-only field - not available in the DB
  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  // users can't query this field - no Field() decorator
  @Column()
  password: string;
}