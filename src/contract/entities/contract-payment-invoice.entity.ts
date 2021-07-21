import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Contract } from './contract.entity'
import { FileStorageItem } from '../../request/entities/file-storage-item.entity'
import { ContractPaymentInvoiceConfirmation } from './contract-payment-confirmation.entity'

@InputType('ContractPaymentInvoiceInputType', { isAbstract: true })
@ObjectType()
@Entity('contract_payment_invoice')
export class ContractPaymentInvoice {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @ManyToOne(() => Contract, (c) => c.payment_invoice)
  @JoinColumn({ name: 'contract_id' })
  @Field(() => Contract)
  contract_id: Contract

  @ManyToOne(() => FileStorageItem, (f) => f.payment_invoice)
  @JoinColumn({ name: 'file_storage_item_id' })
  @Field(() => FileStorageItem)
  file_storage_item_id: FileStorageItem

  @Column()
  @Field(() => Date)
  created_at: Date

  @OneToMany(
    () => ContractPaymentInvoiceConfirmation,
    (cpc) => cpc.contract_payment_invoice_id,
  )
  @Field(() => [ContractPaymentInvoiceConfirmation], { nullable: true })
  confirm: ContractPaymentInvoiceConfirmation[]
}
