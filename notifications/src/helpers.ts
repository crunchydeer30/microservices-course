import path from 'path';

import { IEmailLocals, winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import nodemailer from 'nodemailer';
import Email from 'email-templates';

const logger = winstonLogger(`${config.ELASTIC_URL}`, 'mailTransportHelper', 'debug');

export async function emailTemplates(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    const transport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });

    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build'),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, 'emails', template),
      message: {
        to: receiver,
      },
      locals,
    });
    logger.log('info', `Email sent to ${receiver}`);
  } catch (err) {
    logger.log('error', 'Error sending email', err);
  }
}
