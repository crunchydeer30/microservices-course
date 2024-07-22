import { Channel, ConsumeMessage } from 'amqplib';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import { createConnection } from '@notifications/queues/connection';

const logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsQueueConnection', 'debug');

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
      console.log(JSON.parse(msg!.content.toString() as string));
      channel.ack(msg!);
    });
  } catch (e) {
    logger.log('error', 'Notifications service consumeOrderEmailMessages() error', e);
  }
}
