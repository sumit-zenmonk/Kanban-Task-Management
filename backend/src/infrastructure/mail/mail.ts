import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailService: MailerService) { }

    async sendMail({ to, subject, message }) {
        try {
            await this.mailService.sendMail({
                from: `"Kanban Management" <${process.env.EMAIL_USERNAME}>`,
                to,
                subject,
                html: message,
                text: message,
            });
        } catch (error) {
            console.error('Mail error:', error);
        }
    }
}