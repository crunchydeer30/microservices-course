import { Request, Response, NextFunction } from 'express';
import { BadRequestError, IAuthPayload, NotAuthorizedError } from '@crunchydeer30/microservices-course-shared';
import { verify } from 'jsonwebtoken';
import { config } from '@gateway/config';

class AuthMiddleware {
  public verifyUser(req: Request, _res: Response, _next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError(`Invalid token. Please login`, 'GatewayService verifyUser() method error');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, config.JWT_TOKEN!) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError(`Invalid token. Please login`, 'GatewayService verifyUser() method error');
    }
  }

  public checkAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new BadRequestError('Authentication required', 'GatewayService checkAuthentication() method error');
    }
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
