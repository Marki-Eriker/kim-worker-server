import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreateContractInput {
  @Field(() => String)
  contractNumber: string

  @Field(() => Number)
  fileId: number

  @Field(() => Number)
  requestId: number
}

@ObjectType()
export class CreateContractOutput extends CoreOutput {}
