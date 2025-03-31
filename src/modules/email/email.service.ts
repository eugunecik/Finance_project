import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(
    to: string, 
    subject: string, 
    text: string
  ): Promise<nodemailer.SentMessageInfo> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}