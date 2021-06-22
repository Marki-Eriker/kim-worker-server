import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreEntity } from '../../common/entities/core.entity'
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import { Navigation } from '../../navigation/entities/navigation.entity'

@InputType('AccessInputType', { isAbstract: true })
@ObjectType()
@Entity('access')
export class Access extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  name: string

  @ManyToMany(() => Navigation, { eager: true })
  @JoinTable()
  @Field(() => [Navigation])
  navigation: Navigation[]
}
