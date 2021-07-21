import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import * as sha1 from 'js-sha1'
import * as fs from 'fs'

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const hash = sha1(file.buffer)
    const path = `${this.configService.get('UPLOAD_LINK')}/${hash[0]}/${
      hash[1]
    }`
    fs.mkdirSync(path, { recursive: true })
    fs.writeFileSync(`${path}/${hash}.pdf`, file.buffer)

    return {
      checksum: hash,
    }
  }
}
