import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class ToggleNavigationInput {
  @Field(() => Number)
  navigationId: number
}

@ObjectType()
export class ToggleNavigationOutput extends CoreOutput {}
