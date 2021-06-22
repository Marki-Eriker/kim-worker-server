import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'

@InputType('NavigationInputType', { isAbstract: true })
@ObjectType()
@Entity('navigation')
export class Navigation extends CoreEntity {
  @Column()
  @Field(() => String)
  path: string

  @Column()
  @Field(() => String)
  title: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  icon: string

  @Column({ default: 0 })
  @Field(() => Number, { defaultValue: 0 })
  parentId: number

  @Column({ default: 1 })
  @Field(() => Number, { defaultValue: 1 })
  order: number

  @Column({ default: false })
  @Field(() => Boolean, { defaultValue: false })
  node: boolean

  @Column({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  dev: boolean
}
