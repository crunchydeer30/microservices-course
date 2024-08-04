import { Request, Response } from 'express';

export class HealthController {
  public checkHealth(_req: Request, res: Response) {
    res.status(200).send('GatewayService is up and running');
  }
}

export const healthController = new HealthController();
