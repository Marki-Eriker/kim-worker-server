import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Request } from './request.entity'
import { Contract } from '../../contract/entities/contract.entity'

@InputType('ContractorInputType', { isAbstract: true })
@ObjectType()
@Entity('contractor')
export class Contractor {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  full_name: string

  @Column()
  @Field(() => String)
  short_name: string

  @OneToMany(() => Request, (req) => req.contractor_id)
  @Field(() => [Request])
  requests: Request[]

  @OneToMany(() => Contract, (c) => c.contractor_id)
  @Field(() => [Contract])
  contracts: Contract[]
}
