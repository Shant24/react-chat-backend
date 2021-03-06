import { Request, Response } from 'express';

import { IUser } from '../types/user';
import { UserModel } from '../models';
import generateUserConfirmationToken from '../helpers/hash/userConfirmHash';
import { parseCreatingUserErrors } from '../helpers/errors/parsErrors';

class UserController {
  getAll(req: Request, res: Response) {
    UserModel.find()
      .then((users: IUser[] | null) => {
        if (!users) {
          return res.status(404).json({ error: { message: 'Users not found!' } });
        }

        res.status(200).json(users);
      })
      .catch(() => {
        res.status(404).json({ error: { message: 'Something went wrong!' } });
      });
  }

  getById(req: Request, res: Response) {
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

  create(req: Request, res: Response) {
    const { user }: { user: Partial<IUser> } = req.body;

    if (!user) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const { email, fullName, avatar, password } = user;

    const newUser = new UserModel({
      email,
      fullName,
      avatar: avatar || '',
      password,
      confirmHash: generateUserConfirmationToken(),
    });

    newUser.save()
      .then((value: IUser) => {
        if (!value) {
          return res.status(404).json({ error: { message: 'User not found!' } });
        }

        console.log('User created');
        res.status(201).json({
          email: value.email,
          fullName: value.fullName,
          avatar: value.avatar,
          lastSeen: value.lastSeen,
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
        });
      })
      .catch((e) => {
        const errMessage = parseCreatingUserErrors(e);
        res.status(400).json(errMessage);
      });
  }

  delete(req: Request, res: Response) {
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
