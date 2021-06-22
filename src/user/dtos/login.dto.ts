import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { User } from '../entities/user.entity'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class LoginInput extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
  @Field(() => String, { nullable: true })
  accessToken?: string
}
