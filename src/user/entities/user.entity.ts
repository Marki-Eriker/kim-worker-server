import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { CoreEntity } from '../../common/entities/core.entity'
import { IsEmail, IsString } from 'class-validator'
import { InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { RefreshToken } from '../../token/entities/refresh-token.entity'
import { Access } from '../../access/entities/access.entity'
import { ServiceType } from '../../request/entities/service-type.entity'

export enum UserBaseRole {
  Admin = 'Admin',
  Head = 'Head',
  Worker = 'Worker',
}

registerEnumType(UserBaseRole, { name: 'UserBaseRole' })

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity('users')
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsEmail()
  email: string

  @Column()
  @Field(() => String)
  @IsString()
  fullName: string

  @Column({ select: false })
  @Field(() => String)
  password: string

  @Column({ type: 'enum', enum: UserBaseRole })
  @Field(() => UserBaseRole)
  baseRole: UserBaseRole

  @OneToMany(() => RefreshToken, (token) => token.user)
  @Field(() => [RefreshToken])
  tokens: RefreshToken[]

  @ManyToMany(() => Access, { nullable: true })
  @JoinTable()
  @Field(() => [Access], { nullable: true })
  access?: Access[]

  @Column('int', { array: true, nullable: true })
  @Field(() => [Number], { nullable: true })
  serviceTypes?: number[]

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10)
      } catch (error) {
        throw new InternalServerErrorException()
      }
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return bcrypt.compare(aPassword, this.password)
    } catch (error) {
      return false
    }
  }
}
