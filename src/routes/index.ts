import { Express, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

import UserRoutes from './User.routes';
import ConversationRoutes from './Conversation.routes';
import MessageRoutes from './Message.routes';

const PORT = process.env.PORT || 8080;
const HOST_URL = process.env.CURRENT_HOST_URL;
const environment = process.env.NODE_ENV || 'development';

const fetchDB = async () => {
  const url: string = `${environment === 'development' ? `${HOST_URL}:${PORT}` : HOST_URL}/db.json`;
  const { data }: AxiosResponse = await axios.get(url);
  return data;
};

const routes = {
  init: (app: Express) => {
    app.use(`/user`, UserRoutes);
    app.use(`/conversation`, ConversationRoutes);
    app.use(`/message`, MessageRoutes);

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
  },
};

export default routes;
