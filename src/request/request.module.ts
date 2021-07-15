import { DynamicModule, Module } from '@nestjs/common'
import { RequestService } from './request.service'
import { Request } from './entities/request.entity'
import { ServiceType } from './entities/service-type.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Contractor } from './entities/contractor.entity'
import { OrganizationContact } from './entities/organization-contact.entity'
import { RequestResolver } from './request.resolver'
import { RequestModuleOptions } from './request.interface'
import { CONFIG_OPTIONS } from '../common/common.constants'
import { BankAccount } from './entities/bank-account.entity'
import { Signatory } from './entities/signatory.entity'
import { Ship } from './entities/ship.entity'

// @Module({
//   imports: [
//     TypeOrmModule.forFeature(
//       [Request, ServiceType, Contractor, OrganizationContact],
//       'request',
//     ),
//   ],
//   providers: [RequestService, RequestResolver],
// })
@Module({})
export class RequestModule {
  static forRoot(options: RequestModuleOptions): DynamicModule {
    return {
      module: RequestModule,
      imports: [
        TypeOrmModule.forFeature(
          [
            Request,
            ServiceType,
            Contractor,
            OrganizationContact,
            BankAccount,
            Signatory,
            Ship,
          ],
          'request',
        ),
      ],
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        RequestService,
        RequestResolver,
      ],
    }
  }
}
