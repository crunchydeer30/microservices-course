import { Logger } from 'winston';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@gateway/config';
import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const logger: Logger = winstonLogger(`${config.ELASTIC_URL}`, 'apiGatewayElasticConnection', 'debug');

class Elasticsearch {
  private elasticSearchClient: Client;

  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_URL}`,
    });
  }

  public async checkConnection(): Promise<void> {
    let isConnected = false;
    while (!isConnected) {
      logger.info('GatewayService Connecting to ElasticSearch');
      try {
        const health: ClusterHealthResponse = await this.elasticSearchClient.cluster.health();
        logger.info(`GatewayService ElasticSearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        logger.error('Connection to ElasticSearch failed, Retrying...');
        logger.log('error', 'GatewayService checkConnection() method error', error);
      }
    }
  }
}

export const elasticSearch: Elasticsearch = new Elasticsearch();
