import { Router } from 'express';

import { ConversationController } from '../controllers';

const ConversationRouter = Router();
const ConversationCtrl = new ConversationController();

ConversationRouter.get('/', ConversationCtrl.getAll);
ConversationRouter.get('/:id', ConversationCtrl.getById);
ConversationRouter.delete('/:id', ConversationCtrl.delete);
ConversationRouter.post('/', ConversationCtrl.create);

export default ConversationRouter;
