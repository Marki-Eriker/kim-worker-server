import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Navigation } from './entities/navigation.entity'
import { Repository } from 'typeorm'
import {
  CreateNavigationInput,
  CreateNavigationOutput,
} from './dtos/create-navigation.dto'
import { CoreOutput } from '../common/dtos/core-output.dto'
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

@Injectable()
export class NavigationService {
  constructor(
    @InjectRepository(Navigation)
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async listNavigationItems(): Promise<ListNavigationOutput> {
    try {
      const navigation = await this.navigationRepository.find()

      return { ok: true, navigation }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async createNavigationItem(
    d: CreateNavigationInput,
  ): Promise<CreateNavigationOutput> {
    try {
      if (d.parentId !== 0) {
        const { ok, error } = await this.checkParentExist(d.parentId)
        if (!ok) {
          return { ok, error }
        }
      }

      const navigation = this.navigationRepository.create(d)
      await this.navigationRepository.save(navigation)
      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async editNavigationItem(
    d: EditNavigationInput,
  ): Promise<EditNavigationOutput> {
    try {
      if (d.parentId) {
        const { ok, error } = await this.checkParentExist(d.parentId)
        if (!ok) {
          return { ok, error }
        }
      }

      await this.navigationRepository.save([{ id: d.navigationId, ...d }])
      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async toggleNavigationItemVisible({
    navigationId,
  }: ToggleNavigationInput): Promise<ToggleNavigationOutput> {
    try {
      const navigation = await this.navigationRepository.findOne(navigationId)
      if (!navigation) {
        return { ok: false, error: 'Navigation item not found' }
      }

      navigation.dev = !navigation.dev
      await this.navigationRepository.save(navigation)

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async deleteNavigationItem({
    navigationId,
  }: DeleteNavigationInput): Promise<DeleteNavigationOutput> {
    try {
      const navigation = await this.navigationRepository.findOne(navigationId)
      if (!navigation) {
        return { ok: false, error: 'Navigation item not found' }
      }

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async checkParentExist(id: number): Promise<CoreOutput> {
    try {
      const parent = await this.navigationRepository.findOne(id)
      if (!parent) {
        return {
          ok: false,
          error: 'parent category you entered does not exist',
        }
      }
    } catch (error) {
      return { ok: false, error }
    }
  }
}
