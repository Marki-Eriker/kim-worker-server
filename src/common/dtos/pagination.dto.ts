import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { CoreOutput } from './core-output.dto'

@InputType()
export class PaginationInput {
  @Field(() => Number, { defaultValue: 1 })
  page: number

  @Field(() => Number, { defaultValue: 5 })
  pageSize: number

  @Field(() => String, { defaultValue: 'id' })
  orderField: string

  @Field(() => String, { defaultValue: 'ASC' })
  orderBy: string
}

@ObjectType()
class PaginationInfo {
  @Field(() => Number)
  totalItems: number

  @Field(() => Number)
  totalPages: number

  @Field(() => Number)
  page: number

  @Field(() => Number)
  itemsPerPage: number

  @Field(() => Boolean)
  hasNextPage: boolean

  @Field(() => Boolean)
  hasPreviousPage: boolean
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => PaginationInfo, { nullable: true })
  paginationInfo?: PaginationInfo
}
