import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class DeleteNavigationInput {
  @Field(() => Number)
  navigationId: number
}

@ObjectType()
export class DeleteNavigationOutput extends CoreOutput {}
