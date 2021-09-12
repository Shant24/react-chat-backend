import { Response } from 'express';

import { CustomRequest } from '../types/packages/express';
import { IUser } from '../types/user';
import { UserModel } from '../models';

class UserController {
  async getAll(req: CustomRequest, res: Response) {
    try {
      const users = await UserModel.find();

      if (!users) {
        return res.status(404).json({ error: { message: 'Users not found!' } });
      }

      res.status(200).json(users);
    } catch {
      res.status(404).json({ error: { message: 'Something went wrong!' } });
    }
  }

  getById(req: CustomRequest, res: Response) {
    const { id } = req.params;

    UserModel.findById(id)
      .then((user: IUser | null) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found!' } });
        }

        res.status(200).json(user);
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }

  delete(req: CustomRequest, res: Response) {
    const { id } = req.params;

    UserModel.findByIdAndRemove(id)
      .then((user: IUser | null) => {
        if (!user) {
          return res.status(404).json({ error: { message: 'User not found!' } });
        }

        res.status(200).json({ message: `User ${user.fullName} removed!` });
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }
}

export default UserController;
