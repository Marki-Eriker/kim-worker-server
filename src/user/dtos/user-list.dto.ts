import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto'
import { User } from '../entities/user.entity'

@InputType()
export class UserListInput extends PaginationInput {}

@ObjectType()
class UserListInfo extends PickType(
  User,
  ['id', 'createdAt', 'email', 'fullName'],
  ObjectType,
) {}

@ObjectType()
export class UserListOutput extends PaginationOutput {
  @Field(() => [UserListInfo], { nullable: true })
  users?: UserListInfo[]
}
