import { Field, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { Access } from '../entities/access.entity'

@ObjectType()
export class ListAccessOutput extends CoreOutput {
  @Field(() => [Access], { nullable: true })
  access?: Access[]
}
