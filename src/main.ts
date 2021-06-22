import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const port = process.env.APP_PORT || 3011
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors({ origin: true, credentials: true })
  await app.listen(port)
  console.log('App started on ', port)
}

bootstrap()
