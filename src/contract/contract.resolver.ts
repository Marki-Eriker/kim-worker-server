import { Args, Mutation, Resolver, Query } from '@nestjs/graphql'
import { Contract } from './entities/contract.entity'
import { ContractService } from './contract.service'
import {
  CreateContractInput,
  CreateContractOutput,
} from './dtos/create-contract.dto'
import {
  CreatePaymentInvoiceInput,
  CreatePaymentInvoiceOutput,
} from './dtos/create-payment-invoice.dto'
import {
  CreatePaymentConfirmationInput,
  CreatePaymentConfirmationOutput,
} from './dtos/create-payment-confirmation.dto'
import { Role } from '../auth/base-role.decorator'
import {
  ConfirmPaymentInput,
  ConfirmPaymentOutput,
} from './dtos/confirm-payment.dto'
import { ContractListInput, ContractListOutput } from './dtos/contract-list.dto'
import { AuthUser } from '../auth/auth-user.decorator'
import { User } from '../user/entities/user.entity'
import { ContractInfoInput, ContractInfoOutput } from './dtos/contract-info'

@Resolver(() => Contract)
export class ContractResolver {
  constructor(private readonly contractService: ContractService) {}

  @Mutation(() => CreateContractOutput)
  @Role(['Any'])
  async createContract(
    @Args('input') data: CreateContractInput,
  ): Promise<CreateContractOutput> {
    return this.contractService.createContract(data)
  }

  @Mutation(() => CreatePaymentInvoiceOutput)
  @Role(['Any'])
  async createPaymentInvoice(
    @Args('input') data: CreatePaymentInvoiceInput,
  ): Promise<CreatePaymentInvoiceOutput> {
    return this.contractService.createPaymentInvoice(data)
  }

  @Mutation(() => CreatePaymentConfirmationOutput)
  @Role(['Any'])
  async createPaymentConfirmation(
    @Args('input') data: CreatePaymentConfirmationInput,
  ): Promise<CreatePaymentConfirmationOutput> {
    return this.contractService.createPaymentConfirmation(data)
  }

  @Mutation(() => ConfirmPaymentOutput)
  @Role(['Any'])
  async confirmPayment(
    @Args('input') data: ConfirmPaymentInput,
  ): Promise<ConfirmPaymentOutput> {
    return this.contractService.confirmPayment(data)
  }

  @Query(() => ContractListOutput)
  @Role(['Any'])
  async getContracts(
    @AuthUser() { serviceTypes }: User,
    @Args('input') data: ContractListInput,
  ): Promise<ContractListOutput> {
    return this.contractService.list(data, serviceTypes)
  }

  @Query(() => ContractInfoOutput)
  @Role(['Any'])
  async getContractInfo(
    @Args('input') data: ContractInfoInput,
  ): Promise<ContractInfoOutput> {
    return this.contractService.getInfo(data)
  }
}
