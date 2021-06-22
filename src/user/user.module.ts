import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { UserResolver } from './user.resolver'
import { Navigation } from '../navigation/entities/navigation.entity'
import { Access } from '../access/entities/access.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Navigation, Access])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
