import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { User } from '../entities/user.entity'

@InputType()
export class UserInfoInput {
  @Field(() => Number)
  userId: number
}

@ObjectType()
class getUserInfo extends OmitType(User, ['password', 'tokens'], ObjectType) {}

@ObjectType()
export class UserInfoOutput extends CoreOutput {
  @Field(() => getUserInfo, { nullable: true })
  user?: getUserInfo
}
