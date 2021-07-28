import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {
    this.test()
  }

  async test() {
    try {
      await this.mailerService.sendMail({
        to: 'kyzmin.ig@gmail.com',
        subject: 'Testing mail service',
        text: 'Test',
        html: '<h1>Welcome</h1>',
      })
    } catch (error) {
      console.log(error)
    }
  }
}
