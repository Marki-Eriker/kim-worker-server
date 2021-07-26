import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'
import { Contract } from '../entities/contract.entity'

@InputType()
export class ContractInfoInput {
  @Field(() => Number)
  contractId: number
}

@ObjectType()
export class ContractInfoOutput extends CoreOutput {
  @Field(() => Contract, { nullable: true })
  contract?: Contract
}
