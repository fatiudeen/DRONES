/* eslint-disable no-underscore-dangle */
import express, { Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import middlewares from './middlewares';
import router from './route';

const app: Express = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.use(middlewares.periodicTasks);

// Routes
// app.use('/api/upload', express.static(`${__dirname}/upload`));
app.use('/api', router);
app.use('*', middlewares.error404);
app.use(middlewares.errorHandler);

export default app;
