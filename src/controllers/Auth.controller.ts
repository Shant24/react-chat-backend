import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { CustomRequest } from '../types/packages/express';
import { UserModel } from '../models';
import { createJWToken } from '../utils';
import generateRefreshToken from '../helpers/hash/refreshToken';

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
      res.status(400).json({ error: { message: err.message } });
    }
  }

  logout(req: CustomRequest, res: Response) {
    console.log('req.user', req.user);
    res.status(200).json(req.user);
  }
}

export default AuthController;
