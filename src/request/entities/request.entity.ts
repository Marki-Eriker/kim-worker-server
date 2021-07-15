import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ServiceType } from './service-type.entity'
import { Contractor } from './contractor.entity'
import { OrganizationContact } from './organization-contact.entity'
import { BankAccount } from './bank-account.entity'
import { Signatory } from './signatory.entity'
import { Ship } from './ship.entity'

export enum RequestStatus {
  pending = 'pending',
  rejected = 'rejected',
  accepted = 'accepted',
  completed = 'completed',
}

registerEnumType(RequestStatus, { name: 'RequestStatus' })

@InputType('RequestInputType', { isAbstract: true })
@ObjectType()
@Entity('service_request')
export class Request {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @ManyToOne(() => ServiceType, (type) => type.id, { eager: true })
  @JoinColumn([{ name: 'service_type_id', referencedColumnName: 'id' }])
  @Field(() => ServiceType)
  service_type_id: ServiceType

  @ManyToOne(() => Contractor, (contractor) => contractor.id, { eager: true })
  @JoinColumn([{ name: 'contractor_id', referencedColumnName: 'id' }])
  @Field(() => Contractor)
  contractor_id: Contractor

  @ManyToOne(() => OrganizationContact, (contact) => contact.organization_id, {
    eager: true,
    nullable: true,
  })
  @JoinColumn([
    {
      name: 'organization_contact_id',
      referencedColumnName: 'organization_id',
    },
  ])
  @Field(() => OrganizationContact, { nullable: true })
  organization_contact_id?: OrganizationContact

  @Column()
  @Field(() => String)
  contract_medium_type: string

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  contract_filled_template_id: number

  @Column({ type: 'enum', enum: RequestStatus })
  @Field(() => RequestStatus)
  status: RequestStatus

  @CreateDateColumn()
  @Field(() => Date)
  created_at: Date

  @UpdateDateColumn()
  @Field(() => Date)
  reviewed_at: Date

  @Column({ nullable: true })
  @Field(() => Number, { nullable: true })
  reviewer_id: number

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  reviewer_comment: string

  @ManyToOne(() => BankAccount, (bank) => bank.id, { nullable: true })
  @JoinColumn([{ name: 'bank_account_id', referencedColumnName: 'id' }])
  @Field(() => BankAccount, { nullable: true })
  bank_account_id: BankAccount

  @ManyToOne(() => Signatory, (sign) => sign.id, { nullable: true })
  @JoinColumn([{ name: 'signatory_id', referencedColumnName: 'id' }])
  @Field(() => Signatory, { nullable: true })
  signatory_id: Signatory

  @ManyToMany(() => Ship)
  @JoinTable({
    name: 'service_request_ship',
    joinColumn: { name: 'service_request_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ship_id', referencedColumnName: 'id' },
  })
  @Field(() => [Ship])
  ships: Ship[]
}
