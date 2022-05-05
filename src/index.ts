import { Server } from 'http';
import app from './api/app';
import config from './api/config';

const server = new Server(app);

server.listen(config.port, () => {
  console.log('connected');
});
