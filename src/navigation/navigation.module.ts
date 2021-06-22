import { Module } from '@nestjs/common'
import { NavigationService } from './navigation.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Navigation } from './entities/navigation.entity'
import { NavigationResolver } from './navigation.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Navigation])],
  providers: [NavigationService, NavigationResolver],
})
export class NavigationModule {}
