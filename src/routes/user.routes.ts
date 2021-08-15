import { Router } from 'express';

import { UserController } from '../controllers';

const router = Router();
const User = new UserController();

/**
 * @api user
 * @description users routes
 */
router.get('/', User.getAll);
router.get('/:id', User.getById);
router.delete('/:id', User.delete);
router.post('/', User.create);

module.exports = router;
