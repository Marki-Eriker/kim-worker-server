import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { Access } from './entities/access.entity'
import { AccessService } from './access.service'
import {
  CreateAccessRoleInput,
  CreateAccessRoleOutput,
} from './dtos/create-access.dto'
import { Role } from '../auth/base-role.decorator'
import { ListAccessOutput } from './dtos/list-access.dto'

@Resolver(() => Access)
export class AccessResolver {
  constructor(private readonly accessService: AccessService) {}

  @Query(() => ListAccessOutput)
  @Role(['Admin'])
  async listAccessRole(): Promise<ListAccessOutput> {
    return this.accessService.list()
  }

  @Mutation(() => CreateAccessRoleOutput)
  @Role(['Admin'])
  async createAccessRole(
    @Args('input') d: CreateAccessRoleInput,
  ): Promise<CreateAccessRoleOutput> {
    return this.accessService.create(d)
  }
}
