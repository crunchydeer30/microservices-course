import { IEmailLocals, winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/helpers';

const logger = winstonLogger(`${config.ELASTIC_URL}`, 'mailTransport', 'debug');

export async function sendEmail(template: string, receiver: string, locals: IEmailLocals): Promise<void> {
  try {
    emailTemplates(template, receiver, locals);
    logger.info('Email sent succesfully');
  } catch (err) {
    logger.log('error', 'NotificationService MailTrasport sendEmail() error: ', err);
  }
}
