import { Router } from 'express';

import { ConversationController } from '../controllers';
import { checkAuth, updateLastSeen } from '../middlewares';

const ConversationRouter = Router();
const ConversationCtrl = new ConversationController();

ConversationRouter.get('/',checkAuth, updateLastSeen, ConversationCtrl.getAll);
ConversationRouter.get('/:id',checkAuth, updateLastSeen, ConversationCtrl.getById);
ConversationRouter.delete('/:id',checkAuth, updateLastSeen, ConversationCtrl.delete);
ConversationRouter.post('/',checkAuth, updateLastSeen, ConversationCtrl.create);

export default ConversationRouter;
