import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { CustomRequest } from '../types/packages/express';
import { UserModel } from '../models';
import { createJWToken } from '../utils';
import { parseCreatingUserErrors } from '../helpers/errors/parsErrors';
import generateRefreshToken from '../helpers/hash/refreshToken';
import generateUserConfirmationToken from '../helpers/hash/userConfirmHash';

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({ error: { message: 'Bad request!' } });
    }

    try {
      const foundUser = await UserModel.findOne({ email }, 'password');

      if (!foundUser) {
        throw new Error('The email or password are incorrect!');
      }

      const isPasswordValid = await bcrypt.compare(password, foundUser.password);

      if (!isPasswordValid) {
        throw new Error('The email or password are incorrect!');
      }

      const newToken = createJWToken(foundUser._id!);
      const newRefreshToken = generateRefreshToken();
      const tokens = { jwt: newToken, refreshToken: newRefreshToken };
      const lastSeen = new Date().toISOString();

      await UserModel.findOneAndUpdate(
        { _id: foundUser._id },
        { lastSeen, tokens },
        { new: true, fields: 'email fullName avatar tokens' },
        (err, user) => {
          if (err) {
            throw new Error('Bad request!');
          }

          if (!user) {
            throw new Error('Bad request!');
          }

          res.status(200).json(user);
        },
      );
    } catch (err) {
      // @ts-ignore
      res.status(400).json({ error: { message: err.message } });
    }
  }

  logout(req: CustomRequest, res: Response) {
    console.log('req.user', req.user);
    res.status(200).json(req.user);
  }

  async register(req: Request, res: Response) {
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
}

export default AuthController;
