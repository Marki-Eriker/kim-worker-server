import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Request } from './request.entity'

@InputType('SignatoryInputType')
@ObjectType()
@Entity('contractor_signatory')
export class Signatory {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @Column()
  @Field(() => String)
  acting_basis: string

  @Column()
  @Field(() => String, { nullable: true })
  warrant_number: string

  @Column()
  @Field(() => String, { nullable: true })
  warrant_date: string

  @OneToMany(() => Request, (req) => req.signatory_id)
  @Field(() => [Request])
  requests: Request[]
}
