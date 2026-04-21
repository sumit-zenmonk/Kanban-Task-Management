import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailService: MailerService) { }

    sendMail({ to, subject, message }) {
        this.mailService.sendMail({
            from: `"Kanban Management" <${process.env.EMAIL_USERNAME || 'Kanban Zenmonk Management'}>`,
            to: to,
            subject: subject,
            html: message,
            text: message,
        });
    }
}