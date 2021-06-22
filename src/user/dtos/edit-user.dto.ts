import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { User } from '../entities/user.entity'

@ObjectType()
export class EditUserOutput extends CoreOutput {}

@InputType()
export class EditUserInput extends PartialType(
  PickType(User, ['email', 'fullName', 'baseRole']),
) {
  @Field(() => Number)
  userId: number
}
