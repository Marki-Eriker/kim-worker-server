import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
} from '@nestjs/graphql'
import { Navigation } from '../entities/navigation.entity'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class EditNavigationInput extends PartialType(
  OmitType(Navigation, ['createdAt', 'updatedAt', 'id']),
) {
  @Field(() => Number)
  navigationId: number
}

@ObjectType()
export class EditNavigationOutput extends CoreOutput {}
