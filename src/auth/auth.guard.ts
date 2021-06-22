import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TokenService } from '../token/token.service'
import { UserService } from '../user/user.service'
import { AllowedBaseRoles } from './base-role.decorator'
import { GqlExecutionContext } from '@nestjs/graphql'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedBaseRoles>(
      'roles',
      context.getHandler(),
    )

    if (!roles) {
      return true
    }

    const gqlContext = GqlExecutionContext.create(context).getContext()
    const token = gqlContext.req.headers['x-jwt']

    if (token) {
      const decoded = this.tokenService.verifyAccessToken(token)
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.userService.findById(decoded['id'])
        if (user) {
          gqlContext['user'] = user
          if (roles.includes('Any')) {
            return true
          }
          return roles.includes(user.baseRole)
        }
      }
    }

    return false
  }
}
