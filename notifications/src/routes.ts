import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const healthCheck: Router = Router();

healthCheck.get('/healthcheck', (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('Notification service is up and running!');
});

export default healthCheck;