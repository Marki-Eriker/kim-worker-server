import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class ConfirmPaymentInput {
  @Field(() => Number)
  paymentId: number
}

@ObjectType()
export class ConfirmPaymentOutput extends CoreOutput {}
