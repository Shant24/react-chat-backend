import express from 'express';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
require('dotenv').config({
  path: path.resolve(
    __dirname,
    '..',
    require('fs').existsSync(`.env.${process.env.NODE_ENV}`) ? `.env.${process.env.NODE_ENV}` : '.env',
  ),
});

import dbConnect from './config/db';
import routes from './routes';

const app = express();

dbConnect();

const PORT = process.env.PORT || 7777;
const environment = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

routes.init(app);

app.listen(PORT, () => {
  console.log(`Environment: ${environment}`);
  console.log(`Server is running on port ${PORT}. `, `http://localhost:${PORT}`);
});
