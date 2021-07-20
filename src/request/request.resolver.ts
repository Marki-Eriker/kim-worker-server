import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from './entities/request.entity'
import { RequestService } from './request.service'
import { RequestListInput, RequestListOutput } from './dtos/request-list.dto'
import { Role } from '../auth/base-role.decorator'
import {
  UpdateRequestStatusInput,
  UpdateRequestStatusOutput,
} from './dtos/update-status.dto'
import { RequestInfoInput, RequestInfoOutput } from './dtos/request-info.dto'
import { AuthUser } from '../auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
@Resolver(() => Request)
export class RequestResolver {
  constructor(private readonly requestService: RequestService) {}

  @Query(() => RequestListOutput)
  @Role(['Any'])
  async getRequests(
    @AuthUser() { serviceTypes }: User,
    @Args('input') data: RequestListInput,
  ): Promise<RequestListOutput> {
    return this.requestService.list(data, serviceTypes)
  }

  @Query(() => RequestInfoOutput)
  @Role(['Any'])
  async getRequestInfo(
    @Args('input') data: RequestInfoInput,
  ): Promise<RequestInfoOutput> {
    return this.requestService.getNavigationRequestInfo(data)
  }

  @Mutation(() => UpdateRequestStatusOutput)
  @Role(['Any'])
  async updateRequestStatus(
    @Args('input') data: UpdateRequestStatusInput,
  ): Promise<UpdateRequestStatusOutput> {
    return this.requestService.updateStatus(data)
  }
}
