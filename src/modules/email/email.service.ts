import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'zenasencuk2@gmail.com',
        pass: 'tmtf xocq srmo nzoe',    
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'zenasencuk2@gmail.com',
      to,
      subject,
      text,
    };

    return this.transporter.sendMail(mailOptions);
  }
}