import { User } from '../entities/user.entity'
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'fullName',
  'password',
  'baseRole',
]) {
  @Field(() => [Number])
  accessId: number[]
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {}
