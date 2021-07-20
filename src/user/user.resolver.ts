import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql'
import { User } from './entities/user.entity'
import { UserService } from './user.service'
import { Request } from 'express'
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto'
import { UserListInput, UserListOutput } from './dtos/user-list.dto'
import { Role } from '../auth/base-role.decorator'
import { LoginInput, LoginOutput } from './dtos/login.dto'
import { AuthUser } from '../auth/auth-user.decorator'
import { MeOutput } from './dtos/me.dto'
import {
  EditUserPasswordInput,
  EditUserPasswordOutput,
} from './dtos/edit-user-password.dto'
import { EditUserInput, EditUserOutput } from './dtos/edit-user.dto'
import { DeleteUserInput, DeleteUserOutput } from './dtos/delete-user.dto'
import { CoreOutput } from '../common/dtos/core-output.dto'
import { GrantAccessInput, GrantAccessOutput } from './dtos/grant-access.dto'
import { UserInfoInput, UserInfoOutput } from './dtos/user-info.dto'
import {
  GrantRequestAccessInput,
  GrantRequestAccessOutput,
} from './dtos/grant-request-access.dto'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => LoginOutput)
  async login(
    @Args('data') data: LoginInput,
    @Context('req') req: Request,
  ): Promise<LoginOutput> {
    return this.userService.login(data, req)
  }

  @Mutation(() => CoreOutput)
  async logout(@Context('req') req: Request): Promise<CoreOutput> {
    return this.userService.logout(req)
  }

  @Query(() => LoginOutput)
  async refresh(@Context('req') req: Request): Promise<LoginOutput> {
    return this.userService.refresh(req)
  }

  @Query(() => MeOutput)
  @Role(['Any'])
  me(@AuthUser() authUser: User): Promise<MeOutput> {
    return this.userService.me(authUser)
  }

  @Query(() => UserListOutput)
  @Role(['Admin'])
  async getUsers(@Args('input') data: UserListInput): Promise<UserListOutput> {
    return this.userService.list(data)
  }

  @Query(() => UserInfoOutput)
  @Role(['Admin'])
  async getUser(@Args('input') data: UserInfoInput): Promise<UserInfoOutput> {
    return this.userService.findById(data.userId)
  }

  @Mutation(() => CreateUserOutput)
  @Role(['Admin'])
  async createUser(
    @Args('input') data: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.create(data)
  }

  @Mutation(() => EditUserPasswordOutput)
  @Role(['Any'])
  async editPassword(
    @AuthUser() authUser: User,
    @Args('input') data: EditUserPasswordInput,
  ): Promise<EditUserPasswordOutput> {
    return this.userService.editPassword(authUser, data)
  }

  @Mutation(() => EditUserOutput)
  @Role(['Any'])
  async editUser(
    @AuthUser() authUser: User,
    @Args('input') data: EditUserInput,
  ): Promise<EditUserOutput> {
    return this.userService.editProfile(authUser, data)
  }

  @Mutation(() => DeleteUserOutput)
  @Role(['Admin'])
  async deleteUser(
    @Args('input') data: DeleteUserInput,
  ): Promise<DeleteUserOutput> {
    return this.userService.delete(data)
  }

  @Mutation(() => GrantAccessOutput)
  @Role(['Admin'])
  async grantUserAccess(
    @Args('input') data: GrantAccessInput,
  ): Promise<GrantAccessOutput> {
    return this.userService.grantAccess(data)
  }

  @Mutation(() => GrantAccessOutput)
  @Role(['Admin'])
  async grantRequestAccess(
    @Args('input') data: GrantRequestAccessInput,
  ): Promise<GrantRequestAccessOutput> {
    return this.userService.grantRequestAccess(data)
  }
}
