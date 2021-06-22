import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Access } from './entities/access.entity'
import { Repository } from 'typeorm'
import { Navigation } from '../navigation/entities/navigation.entity'
import {
  CreateAccessRoleInput,
  CreateAccessRoleOutput,
} from './dtos/create-access.dto'
import { ListAccessOutput } from './dtos/list-access.dto'

@Injectable()
export class AccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: Repository<Access>,
    @InjectRepository(Navigation)
    private readonly navigationRepository: Repository<Navigation>,
  ) {}

  async create(d: CreateAccessRoleInput): Promise<CreateAccessRoleOutput> {
    try {
      const navigation = await this.navigationRepository.findByIds(
        d.navigationId,
      )
      if (navigation.length !== d.navigationId.length) {
        return {
          ok: false,
          error: 'navigation item you entered does not exist',
        }
      }

      const access = this.accessRepository.create({ ...d, navigation })
      await this.accessRepository.save(access)

      return { ok: true }
    } catch (error) {
      return { ok: false, error }
    }
  }

  async list(): Promise<ListAccessOutput> {
    try {
      const access = await this.accessRepository.find()

      return { ok: true, access }
    } catch (error) {
      return { ok: false, error }
    }
  }
}
