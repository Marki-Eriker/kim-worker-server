import { Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Any, Repository } from 'typeorm'
import { Request } from './entities/request.entity'
import { RequestListInput, RequestListOutput } from './dtos/request-list.dto'
import {
  UpdateRequestStatusInput,
  UpdateRequestStatusOutput,
} from './dtos/update-status.dto'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { RequestModuleOptions } from './request.interface'
import { RequestInfoInput, RequestInfoOutput } from './dtos/request-info.dto'

@Injectable()
export class RequestService {
  constructor(
    @Inject(CONFIG_OPTIONS)
    private readonly options: RequestModuleOptions,
    @InjectRepository(Request, 'request')
    private readonly requestRepository: Repository<Request>,
  ) {}

  async list(
    d: RequestListInput,
    allowedTypes: number[],
  ): Promise<RequestListOutput> {
    if (!allowedTypes) {
      return { ok: false, error: 'you do not have any allowed request types' }
    }
    try {
      let where = {}
      where = d.status ? { status: d.status } : {}
      where = d.serviceId
        ? { service_type_id: d.serviceId, ...where }
        : { service_type_id: Any(allowedTypes), ...where }

      const [requests, totalItems] = await this.requestRepository.findAndCount({
        skip: (d.page - 1) * d.pageSize,
        take: d.pageSize,
        order: {
          [d.orderField]: d.orderBy.toUpperCase(),
        },
        where,
      })

      const totalPages = Math.ceil(totalItems / d.pageSize)

      return {
        ok: true,
        requests,
        paginationInfo: {
          totalItems,
          totalPages,
          page: d.page,
          itemsPerPage: d.pageSize,
          hasNextPage: totalPages > d.page,
          hasPreviousPage: d.page > 1,
        },
      }
    } catch (error) {
      return { ok: false, error: 'requests not found' }
    }
  }

  async updateStatus(
    d: UpdateRequestStatusInput,
  ): Promise<UpdateRequestStatusOutput> {
    try {
      const request = await this.requestRepository.findOne(d.requestId)

      if (!request) {
        return { ok: false, error: 'request not found' }
      }

      request.status = d.newStatus
      await this.requestRepository.save(request)
      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'fail to update request status' }
    }
  }

  async getNavigationRequestInfo({
    requestId,
  }: RequestInfoInput): Promise<RequestInfoOutput> {
    try {
      const request = await this.requestRepository.findOne(requestId, {
        relations: ['bank_account_id', 'signatory_id', 'ships'],
      })

      if (!request) {
        return { ok: false, error: 'request not found' }
      }

      return { ok: true, request }
    } catch (error) {
      console.log(error)
      return { ok: false, error: 'fail to get request info' }
    }
  }
}
