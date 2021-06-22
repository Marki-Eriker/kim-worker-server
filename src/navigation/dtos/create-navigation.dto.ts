import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { Navigation } from '../entities/navigation.entity'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreateNavigationInput extends PickType(Navigation, [
  'path',
  'title',
]) {
  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => String, { nullable: true })
  icon?: string

  @Field(() => Number, { nullable: true, defaultValue: 0 })
  parentId?: number

  @Field(() => Number, { nullable: true })
  order?: number

  @Field(() => Boolean, { nullable: true })
  node?: boolean
}

@ObjectType()
export class CreateNavigationOutput extends CoreOutput {}
