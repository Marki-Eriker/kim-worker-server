import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class GrantRequestAccessInput {
  @Field(() => [Number])
  requestTypeId: number[]

  @Field(() => Number)
  userId: number
}

@ObjectType()
export class GrantRequestAccessOutput extends CoreOutput {}
