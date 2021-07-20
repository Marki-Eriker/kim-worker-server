import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { User } from '../entities/user.entity'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { Navigation } from '../../navigation/entities/navigation.entity'

@ObjectType()
class UserInfo extends PickType(
  User,
  ['id', 'email', 'fullName', 'baseRole', 'serviceTypes'],
  ObjectType,
) {}

@ObjectType()
export class NavigationInfo extends PickType(
  Navigation,
  ['id', 'parentId', 'path', 'title', 'description', 'icon', 'node', 'order'],
  ObjectType,
) {}

@ObjectType()
export class MeOutput extends CoreOutput {
  @Field(() => UserInfo, { nullable: true })
  user?: UserInfo

  @Field(() => [NavigationInfo], { nullable: true })
  navigation?: NavigationInfo[]
}
