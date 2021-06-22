import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class GrantAccessInput {
  @Field(() => [Number])
  accessId: number[]

  @Field(() => Number)
  userId: number
}

@ObjectType()
export class GrantAccessOutput extends CoreOutput {}
