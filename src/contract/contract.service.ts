import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Contract } from './entities/contract.entity'
import { getRepository, ILike, Repository } from 'typeorm'
import {
  CreateContractInput,
  CreateContractOutput,
} from './dtos/create-contract.dto'
import { Request, RequestStatus } from '../request/entities/request.entity'
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
import { ContractListInput, ContractListOutput } from './dtos/contract-list.dto'
import { Contractor } from '../request/entities/contractor.entity'
import { ContractInfoInput, ContractInfoOutput } from './dtos/contract-info'

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contractor, 'request')
    private readonly contractorRepository: Repository<Contractor>,
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
      const contractor = await this.contractorRepository.findOne(
        data.contractorId,
      )

      if (!file || !request || !contractor) {
        return {
          ok: false,
          error: !file
            ? 'storage item not found'
            : !contractor
            ? 'contractor not found'
            : 'request not found',
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
        contractor_id: contractor,
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

  async list(
    data: ContractListInput,
    allowedTypes: number[],
  ): Promise<ContractListOutput> {
    if (!allowedTypes) {
      return { ok: false, error: 'you do not have any allowed request types' }
    }

    if (data.serviceTypeId && !allowedTypes.includes(data.serviceTypeId)) {
      return {
        ok: false,
        error: 'you do not have permissions for this request type',
      }
    }

    try {
      const serviceTypes = data.serviceTypeId
        ? [data.serviceTypeId]
        : allowedTypes

      const order = data.orderBy === 'DESC' ? 'DESC' : 'ASC'

      const [contracts, totalItems] = await getRepository(Contract, 'request')
        .createQueryBuilder('contract')
        .leftJoinAndSelect('contract.service_request_id', 'service_request')
        .leftJoinAndSelect('contract.file_storage_item_id', 'file_storage_item')
        .leftJoinAndSelect('contract.contractor_id', 'contractor')
        .where('service_request.status = :status', {
          status: RequestStatus.completed,
        })
        .andWhere('service_request.service_type_id IN (:...ids)', {
          ids: serviceTypes,
        })
        .skip((data.page - 1) * data.pageSize)
        .take(data.pageSize)
        .orderBy(`contract.${data.orderField}`, order)
        .getManyAndCount()

      const totalPages = Math.ceil(totalItems / data.pageSize)

      return {
        ok: true,
        contracts,
        paginationInfo: {
          totalItems,
          totalPages,
          page: data.page,
          itemsPerPage: data.pageSize,
          hasNextPage: totalPages > data.page,
          hasPreviousPage: data.page > 1,
        },
      }
    } catch (error) {
      console.log(error)
      return { ok: false, error: 'fail to fetch contracts' }
    }
  }

  async getInfo({
    contractId,
  }: ContractInfoInput): Promise<ContractInfoOutput> {
    try {
      const contract = await this.contractRepository.findOne(contractId, {
        relations: ['service_request_id', 'payment_invoice', 'invoice_confirm'],
      })
      if (!contract) {
        return { ok: false, error: 'Contract not found' }
      }

      return { ok: true, contract }
    } catch (error) {
      return { ok: false, error: 'fail to fetch contract info' }
    }
  }
}
