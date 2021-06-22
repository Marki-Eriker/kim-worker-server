import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class DeleteUserInput {
  @Field(() => Number)
  userId: number
}

@ObjectType()
export class DeleteUserOutput extends CoreOutput {}
