import { Express, Request, Response } from 'express';

import UserRoutes from './User.routes';
import ConversationRoutes from './Conversation.routes';
import MessageRoutes from './Message.routes';
import AuthRoutes from './Auth.routes';
import db from '../public/db';

const fetchDB = async () => {
  const data = db;
  return data;
};

const routes = {
  init: (app: Express) => {
    app.use(`/user`, UserRoutes);
    app.use(`/conversation`, ConversationRoutes);
    app.use(`/message`, MessageRoutes);
    app.use(`/auth`, AuthRoutes);

    app.get('/', async (req: Request, res: Response) => {
      let db: any = [];

      try {
        db = await fetchDB();
      } catch (err) {
        console.log('err', err);
      }

      res.json(db);
    });

    app.get('/dialogues', async (req: Request, res: Response) => {
      let db: any = { dialogues: [] };

      try {
        db = await fetchDB();
      } catch (err) {
        console.log('err', err);
      }

      res.json(db.dialogues);
    });

    app.get('/dialogues/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      let db: any = { dialogues: [] };

      try {
        db = await fetchDB();
      } catch (err) {
        console.log('err', err);
      }

      const dialoguesById = db.dialogues.filter((dialogue: any) => dialogue._id === id);
      res.json(dialoguesById);
    });

    app.get('/messages', async (req: Request, res: Response) => {
      let db: any = { messages: [] };

      try {
        db = await fetchDB();
      } catch (err) {
        console.log('err', err);
      }

      res.json(db.messages);
    });

    app.get('/messages/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      let db: any = { messages: [] };

      try {
        db = await fetchDB();
      } catch (err) {
        console.log('err', err);
      }

      const messagesById = db.messages.filter((message: any) => message.roomId === id);
      res.json(messagesById);
    });
  },
};

export default routes;
