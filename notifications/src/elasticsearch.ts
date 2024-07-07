import { Client } from '@elastic/elasticsearch';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';

const logger: Logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsElasticSearch', 'debug');

const elasticSearchClient = new Client({
  node: config.ELASTIC_URL
});

export async function connect(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health();
      logger.info(`NotificationService ElasticSearch connection status: ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Connection to ElasticSeaRCH failed. Retrying');
      logger.error('error', 'NotificationService checkConnection(): ' , error);
    }
  }
}