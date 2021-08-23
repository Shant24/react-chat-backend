import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { CustomRequest } from '../types/packages/express';
import { IUser } from '../types/user';
import { UserModel } from '../models';
import { parseCreatingUserErrors } from '../helpers/errors/parsErrors';
import { createJWToken } from '../utils';
import generateUserConfirmationToken from '../helpers/hash/userConfirmHash';
import generateRefreshToken from '../helpers/hash/refreshToken';

class AuthController {
  async login(req: CustomRequest, res: Response) {
    console.log('req.body', req.body);

    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).json({ error: { message: 'Bad request!' } });
    }

    try {
      const expectedUser = await UserModel.findOne({ email });

      if (!expectedUser) {
        throw new Error('The email or password are incorrect!');
      }

      const isPasswordValid = await bcrypt.compare(password, expectedUser.password);

      if (!isPasswordValid) {
        throw new Error('The email or password are incorrect!');
      }

      // TODO: do it
    } catch {

    }
  }

  logout(req: CustomRequest, res: Response) {

  }
}

export default AuthController;
