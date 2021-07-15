import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Request } from './request.entity'

@InputType('organizationContactInputType', { isAbstract: true })
@ObjectType()
@Entity('organization_contact')
export class OrganizationContact {
  @PrimaryColumn()
  @Field(() => Number)
  organization_id: number

  @Column()
  @Field(() => String)
  phone: string

  @Column()
  @Field(() => String)
  email: string

  @OneToMany(() => Request, (req) => req.organization_contact_id, {
    nullable: true,
  })
  @Field(() => [Request], { nullable: true })
  requests?: Request[]
}
