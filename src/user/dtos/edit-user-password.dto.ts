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
export class EditUserPasswordOutput extends CoreOutput {}

@InputType()
export class EditUserPasswordInput extends PickType(User, ['password']) {
  @Field(() => Number)
  userId: number

  @Field(() => Boolean, { defaultValue: false })
  deleteCookie: boolean
}
