import { UserBaseRole } from '../user/entities/user.entity'
import { SetMetadata } from '@nestjs/common'

export type AllowedBaseRoles = keyof typeof UserBaseRole | 'Any'

export const Role = (roles: AllowedBaseRoles[]) => SetMetadata('roles', roles)
