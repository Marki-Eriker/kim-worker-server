import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto'
import { Request, RequestStatus } from '../entities/request.entity'

@InputType()
export class RequestListInput extends PaginationInput {
  @Field(() => Number, { nullable: true })
  serviceId?: number

  @Field(() => RequestStatus, { nullable: true })
  status?: RequestStatus
}

@ObjectType()
export class RequestListOutput extends PaginationOutput {
  @Field(() => [Request], { nullable: true })
  requests?: Request[]
}
