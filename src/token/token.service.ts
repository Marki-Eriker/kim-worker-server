import * as jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { Inject, Injectable } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { TokenModuleOptions } from './token.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { RefreshToken } from './entities/refresh-token.entity'
import { Repository } from 'typeorm'
import { User, UserBaseRole } from '../user/entities/user.entity'

@Injectable()
export class TokenService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: TokenModuleOptions,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createAccessToken(
    userId: number,
    roles: UserBaseRole,
  ): Promise<string> {
    return jwt.sign({ id: userId, roles }, this.options.secretKey, {
      expiresIn: Number(this.options.refreshTokenTTL) * 60,
    })
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, this.options.secretKey)
  }

  async createRefreshToken(user: User, agent: string): Promise<RefreshToken> {
    const refreshToken = uuid()
    const expiresIn = new Date(
      Date.now() + (this.options.refreshTokenTTL as any) * 24 * 60 * 60 * 1000,
    )

    await this.checkRefreshTokenCount(user)

    const token = await this.refreshTokenRepository.create({
      token: refreshToken,
      expiresIn,
      agent,
    })
    token.user = user
    await this.refreshTokenRepository.save(token)
    return token
  }

  async findRefreshToken(refreshToken: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne(
      { token: refreshToken },
      { relations: ['user'] },
    )
  }

  async checkRefreshTokenCount(user: User): Promise<void> {
    const [userTokens, count] = await this.refreshTokenRepository.findAndCount({
      where: { user },
      order: { createdAt: 'DESC' },
    })

    if (count >= 5) {
      const slicedTokens = userTokens.slice(4)
      await this.refreshTokenRepository.delete(slicedTokens.map((t) => t.id))
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token })
  }
}
