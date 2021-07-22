import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  PaginationInput,
  PaginationOutput,
} from '../../common/dtos/pagination.dto'
import { Contract } from '../entities/contract.entity'

@InputType()
export class ContractListInput extends PaginationInput {
  @Field(() => Number, { nullable: true })
  serviceTypeId?: number
}

@ObjectType()
export class ContractListOutput extends PaginationOutput {
  @Field(() => [Contract], { nullable: true })
  contracts?: Contract[]
}
