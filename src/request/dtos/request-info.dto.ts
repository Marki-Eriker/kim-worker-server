import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { Request } from '../entities/request.entity'

@InputType()
export class RequestInfoInput {
  @Field(() => Number)
  requestId: number
}

@ObjectType()
export class RequestInfoOutput extends CoreOutput {
  @Field(() => Request, { nullable: true })
  request?: Request
}
