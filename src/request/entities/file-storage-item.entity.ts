import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Contract } from '../../contract/entities/contract.entity'
import { ContractPaymentInvoice } from '../../contract/entities/contract-payment-invoice.entity'
import { ContractPaymentInvoiceConfirmation } from '../../contract/entities/contract-payment-confirmation.entity'

@InputType('FileStorageItemInput', { isAbstract: true })
@ObjectType()
@Entity('file_storage_item')
export class FileStorageItem {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  original_filename: string

  @Column()
  @Field(() => String)
  extension: string

  @Column()
  @Field(() => String)
  mime_type: string

  @Column()
  @Field(() => Number)
  size: number

  @Column()
  @Field(() => String)
  checksum: string

  @Column({ default: Date.now() })
  @Field(() => Date)
  created_at: Date

  @OneToMany(() => Contract, (c) => c.file_storage_item_id)
  @Field(() => [Contract], { nullable: true })
  contracts?: Contract[]

  @OneToMany(() => ContractPaymentInvoice, (cp) => cp.file_storage_item_id)
  @Field(() => [ContractPaymentInvoice], { nullable: true })
  payment_invoice?: ContractPaymentInvoice[]

  @OneToMany(
    () => ContractPaymentInvoiceConfirmation,
    (cpc) => cpc.file_storage_item_id,
  )
  @Field(() => [ContractPaymentInvoiceConfirmation], { nullable: true })
  payment_confirm?: ContractPaymentInvoiceConfirmation[]
}
