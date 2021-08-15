import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import mongoose from 'mongoose';

import { UserController } from './controllers';

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

const User = new UserController();

const fetchDB = async () => {
  const url: string = `${environment === 'development' ? `${HOST_URL}:${PORT}` : HOST_URL}/db.json`;
  const { data }: AxiosResponse = await axios.get(url);
  return data;
};

app.get('/user', User.getAll);
app.get('/user/:id', User.getById);
app.delete('/user/:id', User.delete);
app.post('/user/register', User.create);

app.get('/', async (req: Request, res: Response) => {
  const db = await fetchDB();
  res.json(db);
});

app.get('/dialogues', async (req: Request, res: Response) => {
  const db = await fetchDB();
  res.json(db.dialogues);
});

app.get('/dialogues/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await fetchDB();
  const dialoguesById = db.dialogues.filter((dialogue: any) => dialogue._id === id);
  res.json(dialoguesById);
});

app.get('/messages', async (req: Request, res: Response) => {
  const db = await fetchDB();
  res.json(db.messages);
});

app.get('/messages/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const db = await fetchDB();
  const messagesById = db.messages.filter((message: any) => message.roomId === id);
  res.json(messagesById);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${environment}`);
  console.log(`Link: ${HOST_URL}:${PORT}`);

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
});
