import { start } from '@notifications/server';
import express, { Express } from 'express';

function init(): void {
  const app: Express = express();
  start(app);
}

init();
