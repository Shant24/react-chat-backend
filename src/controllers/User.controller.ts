import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { CustomRequest } from '../types/packages/express';
import { IUser } from '../types/user';
import { UserModel } from '../models';
import { parseCreatingUserErrors } from '../helpers/errors/parsErrors';
import { createJWToken } from '../utils';
import generateUserConfirmationToken from '../helpers/hash/userConfirmHash';
import generateRefreshToken from '../helpers/hash/refreshToken';

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

  async create(req: Request, res: Response) {
    const { email, fullName, avatar, password } = req.body.user || {};

    if (!(email && fullName && password)) {
      return res.status(400).json({ error: { message: 'Bad request!' } });
    }

    const oldUser = await UserModel.findOne({ email });

    if (oldUser) {
      return res.status(409).json({ error: { message: 'User already exist!. Please Login!' } });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email: email.toLowerCase(),
      fullName,
      avatar: avatar || '',
      password: encryptedPassword,
      confirmHash: generateUserConfirmationToken(),
    });

    newUser.save()
      .then(async (createdUser) => {
        if (!createdUser) {
          res.status(404).json({ error: { message: 'Bad request!' } });
        }

        const token = createJWToken(createdUser._id!);
        const newRefreshToken = generateRefreshToken();

        await UserModel.findOneAndUpdate({ _id: createdUser._id }, {
          lastSeen: new Date().toISOString(),
          tokens: { jwt: token, refreshToken: newRefreshToken },
        });

        console.log('User created');
        res.status(201).json({
          _id: createdUser._id,
          email: createdUser.email,
          fullName: createdUser.fullName,
          avatar: createdUser.avatar,
          lastSeen: createdUser.lastSeen,
          createdAt: createdUser.createdAt,
          tokens: { jwt: token, refreshToken: newRefreshToken },
        });
      })
      .catch((e) => {
        const errMessage = parseCreatingUserErrors(e);
        res.status(400).json(errMessage);
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
