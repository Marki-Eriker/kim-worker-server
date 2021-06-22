import { Field, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { Navigation } from '../entities/navigation.entity'

@ObjectType()
export class ListNavigationOutput extends CoreOutput {
  @Field(() => [Navigation], { nullable: true })
  navigation?: Navigation[]
}
