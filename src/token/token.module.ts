import { DynamicModule, Global, Module } from '@nestjs/common'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { TokenModuleOptions } from './token.interface'
import { TokenService } from './token.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RefreshToken } from './entities/refresh-token.entity'

@Module({})
@Global()
export class TokenModule {
  static forRoot(options: TokenModuleOptions): DynamicModule {
    return {
      module: TokenModule,
      imports: [TypeOrmModule.forFeature([RefreshToken])],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        TokenService,
      ],
      exports: [TokenService],
    }
  }
}
