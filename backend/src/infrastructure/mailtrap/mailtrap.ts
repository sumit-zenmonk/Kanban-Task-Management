import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailTrapService {
    constructor(private readonly mailService: MailerService) { }

    sendMail({ to, subject, message }) {
        // this.mailService.sendMail({
        //     from: '"Sumit App" <hello@demomailtrap.co>',
        //     to: to,
        //     subject: subject,
        //     text: message,
        // });
    }
}