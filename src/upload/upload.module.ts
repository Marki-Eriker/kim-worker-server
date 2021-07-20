import { BadRequestException, Module } from '@nestjs/common'
import { UploadController } from './upload.controller'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'

@Module({
  controllers: [UploadController],
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
      fileFilter: function (req, file, cb) {
        if (file.mimetype === 'application/pdf') {
          cb(null, true)
        } else {
          cb(new BadRequestException('mimetype not allowed'), false)
        }
      },
    }),
  ],
})
export class UploadModule {}
