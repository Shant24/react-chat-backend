import { Router } from 'express';

import { UserController } from '../controllers';

const UserRouter = Router();
const UserCtrl = new UserController();

UserRouter.get('/', UserCtrl.getAll);
UserRouter.get('/:id', UserCtrl.getById);
UserRouter.delete('/:id', UserCtrl.delete);
UserRouter.post('/', UserCtrl.create);

export default UserRouter;
