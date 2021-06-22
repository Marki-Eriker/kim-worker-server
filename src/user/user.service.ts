import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User, UserBaseRole } from './entities/user.entity'
import { Repository } from 'typeorm'
import { Request } from 'express'
import { TokenService } from '../token/token.service'
import { UserInfoOutput } from './dtos/user-info.dto'
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto'
import { UserListInput, UserListOutput } from './dtos/user-list.dto'
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto'
import {
  EditUserPasswordInput,
  EditUserPasswordOutput,
} from './dtos/edit-user-password.dto'
import { DeleteUserInput, DeleteUserOutput } from './dtos/delete-user.dto'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { MeOutput } from './dtos/me.dto'
import { REFRESH_TOKEN } from '../common/common.constants'
import { CoreOutput } from '../common/dtos/core-output.dto'
import { Navigation } from '../navigation/entities/navigation.entity'
import { GrantAccessInput } from './dtos/grant-access.dto'
import { Access } from '../access/entities/access.entity'
import { log } from 'util'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Navigation)
    private readonly navigationRepository: Repository<Navigation>,
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
    private readonly tokenService: TokenService,
  ) {}

  async create(d: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exists = await this.userRepository.findOne({ email: d.email })
      if (exists) {
        return { ok: false, error: 'Email already exists' }
      }

      const user = await this.userRepository.create({ ...d })
      await this.userRepository.save(user)
      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async list(p: UserListInput): Promise<UserListOutput> {
    try {
      const [users, total] = await this.userRepository.findAndCount({
        select: ['id', 'email', 'fullName', 'createdAt'],
        skip: (p.page - 1) * p.pageSize,
        take: p.pageSize,
        order: {
          [p.orderField]: p.orderBy,
        },
      })

      const totalPages = Math.ceil(total / p.pageSize)

      return {
        ok: true,
        users,
        paginationInfo: {
          totalItems: total,
          totalPages,
          page: p.page,
          itemsPerPage: p.pageSize,
          hasNextPage: totalPages > p.page,
          hasPreviousPage: p.page > 1,
        },
      }
    } catch (error) {
      return { ok: false, error: 'Users not found' }
    }
  }

  async editProfile(u: User, d: EditUserInput): Promise<EditUserOutput> {
    console.log(u.baseRole.includes('Admin'))
    console.log(d.baseRole)
    if (!u.baseRole.includes('Admin')) {
      return { ok: false, error: 'You have no right to do this' }
    }
    try {
      const user = await this.userRepository.findOne(d.userId)
      if (!user) {
        return { ok: false, error: 'User not found' }
      }
      await this.userRepository.save([{ id: d.userId, ...d }])

      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'Cant edit user' }
    }
  }

  async editPassword(
    u: User,
    d: EditUserPasswordInput,
  ): Promise<EditUserPasswordOutput> {
    if (!u.baseRole.includes('Admin') || d.userId !== u.id) {
      return { ok: false, error: 'You have no right to do this' }
    }
    try {
      const user = await this.userRepository.findOne(d.userId)
      if (!user) {
        return { ok: false, error: 'User not found' }
      }
      user.password = d.password
      await this.userRepository.save(user)

      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'Cant edit password' }
    }
  }

  async delete(d: DeleteUserInput): Promise<DeleteUserOutput> {
    try {
      const user = await this.userRepository.findOne(d.userId)
      if (!user) {
        return { ok: false, error: 'User not found' }
      }
      await this.userRepository.delete(user)

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async findById(id: number): Promise<UserInfoOutput> {
    try {
      const user = await this.userRepository.findOneOrFail(
        { id },
        { relations: ['access'] },
      )
      return { ok: true, user }
    } catch (error) {
      return { ok: false, error: 'User not found' }
    }
  }

  async login(
    { email, password }: LoginInput,
    req: Request,
  ): Promise<LoginOutput> {
    try {
      const user = await this.userRepository.findOne(
        { email },
        { select: ['id', 'password', 'baseRole'] },
      )

      if (!user) {
        return { ok: false, error: 'Invalid credentials' }
      }

      const passwordCorrect = await user.checkPassword(password)
      if (!passwordCorrect) {
        return { ok: false, error: 'Invalid credentials' }
      }

      const accessToken = await this.tokenService.createAccessToken(
        user.id,
        user.baseRole,
      )
      const agent = req.headers['user-agent']
      const refreshToken = await this.tokenService.createRefreshToken(
        user,
        agent,
      )

      req.res.cookie(REFRESH_TOKEN, refreshToken.token, {
        httpOnly: true,
        expires: refreshToken.expiresIn,
      })

      return { ok: true, accessToken }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async me(authUser: User): Promise<MeOutput> {
    try {
      if (authUser.baseRole === UserBaseRole.Admin) {
        const navigation = await this.navigationRepository.find({
          order: { order: 'ASC' },
        })
        return { ok: true, user: authUser, navigation }
      }

      const user = await this.userRepository.findOne(authUser.id, {
        relations: ['access'],
      })

      if (user.access) {
        const navigation = user.access.map((a) => a.navigation).flat()
        return { ok: true, user, navigation }
      }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async refresh(req: Request): Promise<LoginOutput> {
    try {
      const tokenFromCookies = req.cookies[REFRESH_TOKEN]
      if (!tokenFromCookies) {
        return { ok: false, error: 'no refresh token in cookies' }
      }

      const tokenExists = await this.tokenService.findRefreshToken(
        tokenFromCookies,
      )

      if (!tokenExists) {
        return { ok: false, error: 'refresh token not found' }
      }

      const accessToken = await this.tokenService.createAccessToken(
        tokenExists.user.id,
        tokenExists.user.baseRole,
      )

      return { ok: true, accessToken }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async logout(req: Request): Promise<CoreOutput> {
    try {
      const tokenFromCookies = req.cookies[REFRESH_TOKEN]
      if (!tokenFromCookies) {
        return { ok: false, error: 'no refresh token in cookies' }
      }
      await this.tokenService.deleteRefreshToken(tokenFromCookies)
      req.res.cookie(REFRESH_TOKEN, '', { expires: new Date(Date.now()) })
      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async grantAccess({ accessId, userId }: GrantAccessInput) {
    try {
      const access = await this.accessRepository.findByIds(accessId)
      if (!access) {
        return { ok: false, error: 'Access role not found' }
      }
      const user = await this.userRepository.findOne(userId)
      if (!user) {
        return { ok: false, error: 'User not found' }
      }

      user.access = access
      await this.userRepository.save(user)

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }
}
