import { Router } from 'express';

import { MessageController } from '../controllers';

const MessageRouter = Router();
const MessageCtrl = new MessageController();

MessageRouter.get('/:cId', MessageCtrl.getAllById);
MessageRouter.get('/one/:id', MessageCtrl.getById);
MessageRouter.delete('/:id', MessageCtrl.delete);
MessageRouter.post('/', MessageCtrl.create);

export default MessageRouter;
