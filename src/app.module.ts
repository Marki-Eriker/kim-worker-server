import * as Joi from 'joi'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLModule } from '@nestjs/graphql'
import { TokenModule } from './token/token.module'
import { UserModule } from './user/user.module'
import { User } from './user/entities/user.entity'
import { RefreshToken } from './token/entities/refresh-token.entity'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from './jwt/jwt.module'
import { NavigationModule } from './navigation/navigation.module'
import { Navigation } from './navigation/entities/navigation.entity'
import { AccessModule } from './access/access.module'
import { Access } from './access/entities/access.entity'
import { RequestModule } from './request/request.module'
import { Request } from './request/entities/request.entity'
import { ServiceType } from './request/entities/service-type.entity'
import { Contractor } from './request/entities/contractor.entity'
import { OrganizationContact } from './request/entities/organization-contact.entity'
import { BankAccount } from './request/entities/bank-account.entity'
import { Signatory } from './request/entities/signatory.entity'
import { Ship } from './request/entities/ship.entity'
import { UploadModule } from './upload/upload.module'
import { FileStorageItem } from './request/entities/file-storage-item.entity'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.dev.env' : '.test.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_TTL: Joi.string().required(),
        REFRESH_TOKEN_TTL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: process.env.NODE_ENV !== 'prod',
        entities: [User, RefreshToken, Navigation, Access],
        logging: false,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: 'request',
      useFactory: () => ({
        type: 'postgres',
        host: process.env.LK_DB_HOST,
        port: +process.env.LK_DB_PORT,
        username: process.env.LK_DB_USER,
        password: process.env.LK_DB_PASSWORD,
        database: process.env.LK_DB_NAME,
        schema: process.env.LK_DB_SCHEMA,
        entities: [
          Request,
          ServiceType,
          Contractor,
          OrganizationContact,
          BankAccount,
          Signatory,
          Ship,
          FileStorageItem,
        ],
        synchronize: false,
        logging: false,
      }),
    }),
    GraphQLModule.forRoot({
      playground: process.env.NODE_ENV !== 'prod',
      autoSchemaFile: true,
      cors: { credentials: true, origin: true },
      context: ({ req }) => req,
    }),
    TokenModule.forRoot({
      secretKey: process.env.TOKEN_SECRET,
      accessTokenTTL: process.env.ACCESS_TOKEN_TTL,
      refreshTokenTTL: process.env.REFRESH_TOKEN_TTL,
    }),
    JwtModule.forRoot({ privateKey: process.env.TOKEN_SECRET }),
    RequestModule.forRoot({ fileLink: process.env.FILE_LINK }),
    UserModule,
    AuthModule,
    NavigationModule,
    AccessModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
