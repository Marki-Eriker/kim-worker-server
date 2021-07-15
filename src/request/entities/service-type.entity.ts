import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Request } from './request.entity'

@InputType('ServiceTypeInputType', { isAbstract: true })
@ObjectType()
@Entity('service_type')
export class ServiceType {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @OneToMany(() => Request, (req) => req.service_type_id)
  @Field(() => [Request])
  requests: Request[]
}
