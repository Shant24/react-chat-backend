import express from 'express';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';

import dbConnect from './config/db';
import routes from './routes';

const app = express();
dotenv.config();
dbConnect();

const PORT = process.env.PORT || 7777;
const HOST_URL = process.env.CURRENT_HOST_URL || '';
const environment = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

routes.init(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${environment}`);
  console.log(`Link: ${HOST_URL}:${PORT}`);
});
