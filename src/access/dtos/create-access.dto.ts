import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql'
import { Access } from '../entities/access.entity'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreateAccessRoleInput extends PickType(Access, ['name']) {
  @Field(() => [Number])
  navigationId: number[]
}

@ObjectType()
export class CreateAccessRoleOutput extends CoreOutput {}
