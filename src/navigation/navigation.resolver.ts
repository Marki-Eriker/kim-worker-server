import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Navigation } from './entities/navigation.entity'
import { NavigationService } from './navigation.service'
import { Role } from '../auth/base-role.decorator'
import {
  CreateNavigationInput,
  CreateNavigationOutput,
} from './dtos/create-navigation.dto'
import {
  EditNavigationInput,
  EditNavigationOutput,
} from './dtos/edit-navigation.dto'
import {
  DeleteNavigationInput,
  DeleteNavigationOutput,
} from './dtos/delete-navigation.dto'
import {
  ToggleNavigationInput,
  ToggleNavigationOutput,
} from './dtos/toggle-navigation.dto'
import { ListNavigationOutput } from './dtos/list-navigation.dto'

@Resolver(() => Navigation)
export class NavigationResolver {
  constructor(private readonly navigationService: NavigationService) {}

  @Query(() => ListNavigationOutput)
  @Role(['Admin'])
  getNavigationList(): Promise<ListNavigationOutput> {
    return this.navigationService.listNavigationItems()
  }

  @Mutation(() => CreateNavigationOutput)
  @Role(['Admin'])
  async createNavigationItem(
    @Args('input') d: CreateNavigationInput,
  ): Promise<CreateNavigationOutput> {
    return this.navigationService.createNavigationItem(d)
  }

  @Mutation(() => EditNavigationOutput)
  @Role(['Admin'])
  async editNavigationItem(
    @Args('input') d: EditNavigationInput,
  ): Promise<EditNavigationOutput> {
    return this.navigationService.editNavigationItem(d)
  }

  @Mutation(() => DeleteNavigationOutput)
  @Role(['Admin'])
  async deleteNavigationItem(
    @Args('input') d: DeleteNavigationInput,
  ): Promise<DeleteNavigationOutput> {
    return this.navigationService.deleteNavigationItem(d)
  }

  @Mutation(() => ToggleNavigationOutput)
  @Role(['Admin'])
  async toggleVisibleNavigationItem(
    @Args('input') d: ToggleNavigationInput,
  ): Promise<ToggleNavigationOutput> {
    return this.navigationService.toggleNavigationItemVisible(d)
  }
}
