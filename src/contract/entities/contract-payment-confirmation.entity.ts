import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { FileStorageItem } from '../../request/entities/file-storage-item.entity'
import { ContractPaymentInvoice } from './contract-payment-invoice.entity'
import { Contract } from './contract.entity'

@InputType('ContractPaymentInvoiceConfirmationInputType', { isAbstract: true })
@ObjectType()
@Entity('contract_payment_confirmation')
export class ContractPaymentInvoiceConfirmation {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @ManyToOne(() => FileStorageItem, (f) => f.payment_confirm, { eager: true })
  @JoinColumn({ name: 'file_storage_item_id' })
  @Field(() => FileStorageItem)
  file_storage_item_id: FileStorageItem

  @ManyToOne(() => ContractPaymentInvoice, (cp) => cp.confirm)
  @JoinColumn({ name: 'contract_payment_invoice_id' })
  @Field(() => ContractPaymentInvoice)
  contract_payment_invoice_id: ContractPaymentInvoice

  @Column()
  @Field(() => Boolean)
  proven: boolean

  @ManyToOne(() => Contract, (c) => c.invoice_confirm)
  @JoinColumn({ name: 'contract_id' })
  @Field(() => Contract)
  contract_id: Contract

  @Column()
  @Field(() => Date)
  created_at: Date

  @Column()
  @Field(() => Date)
  updated_at: Date
}
