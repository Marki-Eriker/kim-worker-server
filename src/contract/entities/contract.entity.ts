import { Field, InputType, ObjectType } from '@nestjs/graphql'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Request } from '../../request/entities/request.entity'
import { FileStorageItem } from '../../request/entities/file-storage-item.entity'
import { ContractPaymentInvoice } from './contract-payment-invoice.entity'
import { ContractPaymentInvoiceConfirmation } from './contract-payment-confirmation.entity'
import { Contractor } from '../../request/entities/contractor.entity'

@InputType('ContractInput', { isAbstract: true })
@ObjectType()
@Entity('contract')
export class Contract {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @ManyToOne(() => Request, (r) => r.contracts)
  @JoinColumn({ name: 'service_request_id' })
  @Field(() => Request)
  service_request_id: Request

  @Column()
  @Field(() => String)
  number: string

  @Column()
  @Field(() => Date)
  created_at: Date

  @ManyToOne(() => Contractor, (c) => c.contracts)
  @JoinColumn({ name: 'contractor_id' })
  @Field(() => Contractor)
  contractor_id: Contractor

  @ManyToOne(() => FileStorageItem, (f) => f.contracts, { eager: true })
  @JoinColumn({ name: 'file_storage_item_id' })
  @Field(() => FileStorageItem, { nullable: true })
  file_storage_item_id?: FileStorageItem

  @OneToMany(() => ContractPaymentInvoice, (cp) => cp.contract_id)
  @Field(() => [ContractPaymentInvoice], { nullable: true })
  payment_invoice?: ContractPaymentInvoice[]

  @OneToMany(() => ContractPaymentInvoiceConfirmation, (cpc) => cpc.contract_id)
  @Field(() => [ContractPaymentInvoiceConfirmation], { nullable: true })
  invoice_confirm?: ContractPaymentInvoiceConfirmation[]
}
