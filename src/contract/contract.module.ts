import { Module } from '@nestjs/common'
import { ContractService } from './contract.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { ContractResolver } from './contract.resolver'
import { FileStorageItem } from '../request/entities/file-storage-item.entity'
import { Request } from '../request/entities/request.entity'
import { ContractPaymentInvoice } from './entities/contract-payment-invoice.entity'
import { ContractPaymentInvoiceConfirmation } from './entities/contract-payment-confirmation.entity'
import { Contractor } from '../request/entities/contractor.entity'

@Module({
  providers: [ContractService, ContractResolver],
  imports: [
    TypeOrmModule.forFeature(
      [
        Contract,
        FileStorageItem,
        Request,
        ContractPaymentInvoice,
        ContractPaymentInvoiceConfirmation,
        Contractor,
      ],
      'request',
    ),
  ],
})
export class ContractModule {}
