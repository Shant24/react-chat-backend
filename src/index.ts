import express, { Request, Response } from 'express';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const db = require('../db.json');

const app = express();

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.CURRENT_HOST_URL;
const environment = process.env.NODE_ENV || 'development';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*', credentials: true }));
app.use(logger('dev'));

app.get('/', (req: Request, res: Response) => {
  res.json(db);
});

app.get('/dialogues', (req: Request, res: Response) => {
  res.json(db.dialogues);
});

app.get('/dialogues/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const dialoguesById = db.dialogues.filter((dialogue: any) => dialogue._id === id);
  res.json(dialoguesById);
});

app.get('/messages', (req: Request, res: Response) => {
  res.json(db.messages);
});

app.get('/messages/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const messagesById = db.messages.filter((message: any) => message.roomId === id);
  res.json(messagesById);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${environment}`);
  console.log(`Link: ${HOST_URL}:${PORT}`);
});
