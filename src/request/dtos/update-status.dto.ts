import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { RequestStatus } from '../entities/request.entity'

@InputType()
export class UpdateRequestStatusInput {
  @Field(() => Number)
  requestId: string

  @Field(() => RequestStatus)
  newStatus: RequestStatus
}

@ObjectType()
export class UpdateRequestStatusOutput extends CoreOutput {}
