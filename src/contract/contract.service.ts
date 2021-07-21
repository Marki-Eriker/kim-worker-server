import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { ILike, Repository } from 'typeorm'
import {
  CreateContractInput,
  CreateContractOutput,
} from './dtos/create-contract.dto'
import { Request } from '../request/entities/request.entity'
import { FileStorageItem } from '../request/entities/file-storage-item.entity'
import {
  CreatePaymentInvoiceInput,
  CreatePaymentInvoiceOutput,
} from './dtos/create-payment-invoice.dto'
import {
  CreatePaymentConfirmationInput,
  CreatePaymentConfirmationOutput,
} from './dtos/create-payment-confirmation.dto'
import { ContractPaymentInvoice } from './entities/contract-payment-invoice.entity'
import { ContractPaymentInvoiceConfirmation } from './entities/contract-payment-confirmation.entity'
import {
  ConfirmPaymentInput,
  ConfirmPaymentOutput,
} from './dtos/confirm-payment.dto'

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract, 'request')
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Request, 'request')
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(FileStorageItem, 'request')
    private readonly fileStorageItemRepository: Repository<FileStorageItem>,
    @InjectRepository(ContractPaymentInvoice, 'request')
    private readonly contractPaymentInvoiceRepository: Repository<ContractPaymentInvoice>,
    @InjectRepository(ContractPaymentInvoiceConfirmation, 'request')
    private readonly contractPaymentInvoiceConfirmationRepository: Repository<ContractPaymentInvoiceConfirmation>,
  ) {}

  async createContract(
    data: CreateContractInput,
  ): Promise<CreateContractOutput> {
    try {
      const file = await this.fileStorageItemRepository.findOne(data.fileId)
      const request = await this.requestRepository.findOne(data.requestId)

      if (!file || !request) {
        return {
          ok: false,
          error: !file ? 'storage item not found' : 'request not found',
        }
      }

      const contract = await this.contractRepository.findOne({
        where: {
          number: ILike(`%${data.contractNumber}%`),
          service_request_id: data.requestId,
        },
      })

      if (contract) {
        contract.file_storage_item_id = file
        await this.contractRepository.save(contract)

        return { ok: true }
      }

      const newContract = this.contractRepository.create({
        service_request_id: request,
        number: data.contractNumber,
        file_storage_item_id: file,
      })

      await this.contractRepository.save(newContract)

      return { ok: true }
    } catch (error) {
      console.log(error)
      return { ok: false, error: 'can not create contact' }
    }
  }

  async createPaymentInvoice(
    data: CreatePaymentInvoiceInput,
  ): Promise<CreatePaymentInvoiceOutput> {
    try {
      const contract = await this.contractRepository.findOne(data.contractId)
      if (!contract) {
        return { ok: false, error: 'contract not found' }
      }

      const file = await this.fileStorageItemRepository.findOne(data.fileId)
      if (!file) {
        return { ok: false, error: 'file not found' }
      }

      const invoice = this.contractPaymentInvoiceRepository.create({
        contract_id: contract,
        file_storage_item_id: file,
      })

      await this.contractPaymentInvoiceRepository.save(invoice)

      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'can not create payment invoice' }
    }
  }

  async createPaymentConfirmation(
    data: CreatePaymentConfirmationInput,
  ): Promise<CreatePaymentConfirmationOutput> {
    try {
      const contract = await this.contractRepository.findOne(data.contractId)
      if (!contract) {
        return { ok: false, error: 'contract not found' }
      }

      const file = await this.fileStorageItemRepository.findOne(data.fileId)
      if (!file) {
        return { ok: false, error: 'file not found' }
      }

      const invoice = await this.contractPaymentInvoiceRepository.findOne(
        data.invoiceId,
      )
      if (!invoice) {
        return { ok: false, error: 'invoice not found' }
      }

      const confirm = await this.contractPaymentInvoiceConfirmationRepository.create(
        {
          file_storage_item_id: file,
          contract_id: contract,
          contract_payment_invoice_id: invoice,
        },
      )

      await this.contractPaymentInvoiceConfirmationRepository.save(confirm)

      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'can not create payment confirmation' }
    }
  }

  async confirmPayment(
    data: ConfirmPaymentInput,
  ): Promise<ConfirmPaymentOutput> {
    try {
      const payment = await this.contractPaymentInvoiceConfirmationRepository.findOne(
        data.paymentId,
      )
      if (!payment) {
        return { ok: false, error: 'payment not found' }
      }

      payment.proven = true
      await this.contractPaymentInvoiceConfirmationRepository.save(payment)

      return { ok: true }
    } catch (error) {
      return { ok: false, error: 'can not confirm payment' }
    }
  }
}
