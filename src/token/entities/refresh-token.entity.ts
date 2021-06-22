import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreEntity } from '../../common/entities/core.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from '../../user/entities/user.entity'

@InputType('RefreshTokenInputType', { isAbstract: true })
@ObjectType()
@Entity('refresh-token')
export class RefreshToken extends CoreEntity {
  @Column()
  @Field(() => String)
  token: string

  @Column()
  @Field(() => String)
  agent: string

  @Column()
  @Field(() => Date)
  expiresIn: Date

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tokens, { onDelete: 'CASCADE' })
  user: User
}
