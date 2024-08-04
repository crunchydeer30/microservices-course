import { CustomError, IErrorResponse, winstonLogger } from '@crunchydeer30/microservices-course-shared';
import { Logger } from 'winston';
import { Application, json, NextFunction, urlencoded, Request, Response } from 'express';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { StatusCodes } from 'http-status-codes';
import * as http from 'node:http';
import * as process from 'node:process';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elasticsearch';

const PORT = 8000;
const logger: Logger = winstonLogger(config.ELASTIC_URL as string, 'apiGatewayServer', 'debug');

export class GatewayServer {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    void this.startServer(this.app);
    void this.startElasticSearch();
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [config.SECRET_KEY_ONE as string, config.SECRET_KEY_TWO as string],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '100mb' }));
    app.use(urlencoded({ extended: true, limit: '10kb' }));
  }

  private routesMiddleware(_app: Application): void {}

  private async startElasticSearch(): Promise<void> {
    await elasticSearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, _next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      logger.log('error', `url: ${fullUrl} endpoint does not exists.`);
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'endpoint does not exists',
      });
    });

    app.use((error: IErrorResponse, _req: Request, res: Response, _next: NextFunction) => {
      logger.log('error', `GatewayService: ${error.comingFrom}:`, error.message);
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json(error.serializeErrors());
      }
      res.status(StatusCodes.NOT_FOUND).json({
        message: 'The endpoint does not exists',
      });
    });
  }

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      await this.startHttpServer(httpServer);
    } catch (err) {
      logger.log('error', 'GatewayService startServer() error method', err);
      process.exit(1);
    }
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      logger.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(PORT, () => {
        logger.info(`Gateway server running on port ${PORT}`);
      });
    } catch (err) {
      logger.log('error', 'GatewayService startHttpServer() error method', err);
    }
  }
}
