import { CanActivate, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { REFRESH_TOKEN } from '../common/common.constants'

@Injectable()
export class CookieTokenGuard implements CanActivate {
  async canActivate(context: GqlExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext()
    const tokenFromCookies = gqlContext.req.cookies[REFRESH_TOKEN]

    return !!tokenFromCookies
  }
}
