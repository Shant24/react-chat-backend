import express from 'express';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import routes from './routes';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.CURRENT_HOST_URL;
const environment = process.env.NODE_ENV || 'development';
const MONGO_URL = process.env.MONGO_URL || '';

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((err) => {
    console.log('Error: ', err);
  });

routes.init(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${environment}`);
  console.log(`Link: ${HOST_URL}:${PORT}`);
});
