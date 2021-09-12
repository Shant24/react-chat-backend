import { Router } from 'express';

import { UserController } from '../controllers';
import { checkAuth, updateLastSeen } from '../middlewares';

const UserRouter = Router();
const UserCtrl = new UserController();

UserRouter.get('/', checkAuth, updateLastSeen, UserCtrl.getAll);
UserRouter.get('/:id', checkAuth, updateLastSeen, UserCtrl.getById);
UserRouter.delete('/:id', checkAuth, updateLastSeen, UserCtrl.delete);

export default UserRouter;
