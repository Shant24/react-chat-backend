import { Router } from 'express';

import { AuthController } from '../controllers';
import { checkAuth, updateLastSeen } from '../middlewares';

const AuthRouter = Router();
const AuthCtrl = new AuthController();

AuthRouter.post('/register', AuthCtrl.register);
AuthRouter.post('/login', AuthCtrl.login);
AuthRouter.get('/logout', checkAuth, updateLastSeen, AuthCtrl.logout);

export default AuthRouter;
