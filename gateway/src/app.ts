import express from 'express';
import { GatewayServer } from '@gateway/server';

class Application {
  public init(): void {
    const app = express();
    const server: GatewayServer = new GatewayServer(app);
    server.start();
  }
}

const app: Application = new Application();
app.init();
