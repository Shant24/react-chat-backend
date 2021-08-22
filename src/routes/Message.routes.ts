import { Router } from 'express';

import { MessageController } from '../controllers';
import { checkAuth, updateLastSeen } from '../middlewares';

const MessageRouter = Router();
const MessageCtrl = new MessageController();

MessageRouter.get('/:cId',checkAuth, updateLastSeen, MessageCtrl.getAllById);
MessageRouter.get('/one/:id',checkAuth, updateLastSeen, MessageCtrl.getById);
MessageRouter.delete('/:id',checkAuth, updateLastSeen, MessageCtrl.delete);
MessageRouter.post('/',checkAuth, updateLastSeen, MessageCtrl.create);

export default MessageRouter;
