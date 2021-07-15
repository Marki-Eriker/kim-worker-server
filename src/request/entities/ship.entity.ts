import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@InputType('ShipInputType')
@ObjectType()
@Entity('ship')
export class Ship {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  name: string

  @Column()
  @Field(() => String, { nullable: true })
  hull_number: string

  @Column()
  @Field(() => String)
  project_number: string

  @Column()
  @Field(() => Number)
  length: number

  @Column()
  @Field(() => Number)
  width: number

  @Column()
  @Field(() => Number)
  hull_height: number

  @Column()
  @Field(() => Number)
  cubic: number

  @Column()
  @Field(() => String)
  flag: string

  @Column('int', { array: true })
  @Field(() => [Number])
  ship_confirm_params_certificate_ids: number[]

  @Column('int', { array: true })
  @Field(() => [Number])
  owner_ship_rights_certificate_ids: number[]
}
