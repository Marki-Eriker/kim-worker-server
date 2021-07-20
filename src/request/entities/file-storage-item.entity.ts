import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Field, InputType, ObjectType } from '@nestjs/graphql'

@InputType('FileStorageItemInput', { isAbstract: true })
@ObjectType()
@Entity('file-storage-item')
export class FileStorageItem {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number

  @Column()
  @Field(() => String)
  original_filename: string

  @Column()
  @Field(() => String)
  extension: string

  @Column()
  @Field(() => String)
  mime_type: string

  @Column()
  @Field(() => Number)
  size: number

  @Column()
  @Field(() => String)
  checksum: string

  @Column({ default: Date.now() })
  @Field(() => Date)
  created_at: Date
}
