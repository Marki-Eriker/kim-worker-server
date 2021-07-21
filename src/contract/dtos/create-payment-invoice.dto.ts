import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class CreatePaymentInvoiceInput {
  @Field(() => Number)
  contractId: number

  @Field(() => Number)
  fileId: number
}

@ObjectType()
export class CreatePaymentInvoiceOutput extends CoreOutput {}
