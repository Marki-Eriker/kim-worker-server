import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from '../../common/dtos/core-output.dto'

@InputType()
export class SaveStorageItemInput {
  @Field(() => String)
  fileName: string

  @Field(() => String)
  extension: string

  @Field(() => String)
  mimetype: string

  @Field(() => Number)
  size: number

  @Field(() => String)
  checksum: string
}

@ObjectType()
export class SaveStorageItemOutput extends CoreOutput {
  @Field(() => Number, { nullable: true })
  contractId?: number
}
