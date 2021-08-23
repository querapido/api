import { Field, ID, ObjectType } from "type-graphql";
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
  name: string;

  // users can't query this field - no Field() decorator
  @Column()
  password: string;
}