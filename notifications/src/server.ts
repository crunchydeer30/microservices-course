import 'express-async-errors';
import * as http from 'node:http';
import { Logger } from 'winston';
import { winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { config } from '@notifications/config';
import { Application } from 'express';
import healthCheck from '@notifications/routes';
import { connect as connectElasticSearch } from '@notifications/elasticsearch';

const logger: Logger = winstonLogger(`${config.ELASTIC_URL}`, 'notificationsServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use('', healthCheck);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {

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
  } catch(e) {
    logger.log('error', 'Notification Service startSever(): ' + e);
  }
}