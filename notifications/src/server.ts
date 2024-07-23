import 'express-async-errors';
import * as http from 'node:http';

import { Logger } from 'winston';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import { Application } from 'express';
import healthCheck from '@notifications/routes';
import { connect as connectElasticSearch } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages } from '@notifications/queues/email.consumer';

import { consumeOrderEmailMessages } from './queues/order.consumer';

const logger: Logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthCheck);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  // const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=random_token`;
  // const messageDetails: IEmailMessageDetails = {
  //   receiverEmail: `${config.SENDER_EMAIL}`,
  //   resetLink: verificationLink,
  //   username: 'Manny',
  //   template: 'forgotPassword',
  // };
  // await emailChannel.assertExchange('email-notifcation', 'direct');
  // const message = JSON.stringify(messageDetails);
  // emailChannel.publish('email-notification', 'auth-email', Buffer.from(message));
}

async function startElasticSearch(): Promise<void> {
  await connectElasticSearch();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = http.createServer(app);
    logger.info(`Worker with process id of ${process.pid} on notifications service has started`);
    httpServer.listen(config.PORT, () => {
      logger.log('info', `Notification Service listening on port ${config.PORT}`);
    });
  } catch (e) {
    logger.log('error', `Notification Service startSever(): ${e}`);
  }
}
