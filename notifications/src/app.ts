import { start } from '@notifications/server';
import express from 'express';
const app = express();
start(app);