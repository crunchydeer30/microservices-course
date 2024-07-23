import { Channel, ConsumeMessage } from 'amqplib';
import { IEmailLocals, winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';

import { sendEmail } from './mail.transport';

const logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsQueueConnection', 'debug');

export async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const { queue } = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queue, exchangeName, routingKey);
    await channel.consume(queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        verifyLink,
        resetLink,
      };
      await sendEmail(template, receiverEmail, locals);
      console.log(JSON.parse(msg!.content.toString() as string));
      channel.ack(msg!);
    });
  } catch (e) {
    logger.log('error', 'Notifications service consumeAuthEmailMessages() error', e);
  }
}

export async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    const exchangeName = 'order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const { queue } = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queue, exchangeName, routingKey);
    await channel.consume(queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total,
      };
      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
      channel.ack(msg!);
    });
  } catch (e) {
    logger.log('error', 'Notifications service consumeOrderEmailMessages() error', e);
  }
}
