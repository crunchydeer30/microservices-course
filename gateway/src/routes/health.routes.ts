import { Router } from 'express';
import { healthController } from '@gateway/controllers/health.controller';

class HealthRoutes {
  constructor(private readonly router = Router()) {}

  public routes(): Router {
    this.router.get('/health', healthController.checkHealth);
    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
