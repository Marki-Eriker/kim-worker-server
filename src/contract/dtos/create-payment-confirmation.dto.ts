import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreatePaymentConfirmationInput {
  @Field(() => Number)
  fileId: number

  @Field(() => Number)
  invoiceId: number

  @Field(() => Number)
  contractId: number
}

@ObjectType()
export class CreatePaymentConfirmationOutput extends CoreOutput {}
