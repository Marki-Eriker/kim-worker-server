import { Module } from '@nestjs/common'
import { AccessService } from './access.service'
import { AccessResolver } from './access.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Access } from './entities/access.entity'
import { Navigation } from '../navigation/entities/navigation.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Access, Navigation])],
  providers: [AccessService, AccessResolver],
  exports: [AccessService],
})
export class AccessModule {}
