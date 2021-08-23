import { Router } from 'express';

import { UserController } from '../controllers';
import { checkAuth, updateLastSeen } from '../middlewares';
import AuthController from '../controllers/Auth.controller';

const UserRouter = Router();
const UserCtrl = new UserController();
const AuthCtrl = new AuthController();

UserRouter.get('/', checkAuth, updateLastSeen, UserCtrl.getAll);
UserRouter.get('/:id', checkAuth, updateLastSeen, UserCtrl.getById);
UserRouter.delete('/:id', checkAuth, updateLastSeen, UserCtrl.delete);
UserRouter.post('/', UserCtrl.create);
UserRouter.post('/login', AuthCtrl.login);
UserRouter.get('/logout', checkAuth, updateLastSeen, AuthCtrl.logout);

export default UserRouter;
