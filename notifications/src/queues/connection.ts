import { config } from '@notifications/config';
import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';

const logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    logger.info('Notifications service connected to queue successfully');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    logger.log('error', 'notifications createConnection', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
    logger.info('Notifications service disconnected from queue successfully');
  });
}

export { createConnection, closeConnection };
