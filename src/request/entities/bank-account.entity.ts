import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Request } from './request.entity'

@InputType('BankAccountInputType')
@ObjectType()
@Entity('bank_account')
export class BankAccount {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  account_number: string

  @Column()
  @Field(() => String)
  correspondent_account_number: string

  @Column()
  @Field(() => String)
  bik: string

  @Column()
  @Field(() => String)
  bank_name: string

  @OneToMany(() => Request, (req) => req.bank_account_id)
  @Field(() => [Request])
  requests: Request[]
}
